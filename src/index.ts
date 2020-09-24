// SPDX-License-Identifier: MIT
// Copyright Wictor Wilén 2020

import { AppConfigurationClient, AppConfigurationClientOptions } from "@azure/app-configuration";
import { DefaultAzureCredential, EnvironmentCredential, TokenCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import { URI } from 'vscode-uri';

/**
 * Options for envAppConfiguration
 */
export declare type Options = {
    /**
     * Azure Application Configuration connection string
     * @description Use this to authenticate using a connection string
     */
    appConfigConnectionString?: string;
    /**
     * Azure Application Configuration options
     */
    appConfigOptions?: AppConfigurationClientOptions;

    /**
     * Address of the App Config service
     * @description Use this in combination with tokenCredential to sign in using a managed identity
     */
    endpoint?: string;

    /**
     * Credentials to use
     */
    tokenCredential?: TokenCredential

    /**
     * Azure Application Configuration labels that will be imported
     * Up to five labels can be selected, comma separated
     */
    labelFilter?: string;

    /**
     * Set to true to include linked KeyVault secrets
     * @description Uses Azure Default Credentials. Specify 
     * AZURE_CLIENT, AZURE_CLIENT_SECRET & AZURE_TENANT in App Configuration or as 
     * environment variables.
     * See https://docs.microsoft.com/en-us/azure/key-vault/general/managed-identity for more information
     */
    includeKeyVaultSecrets?: boolean;

}

/**
 * Reads configuration from Azure Application Configuration and copies the values
 * into node `process.env` properties
 * @param options Options
 */
export const envAppConfiguration = async (options: Options) => {
    let appConfig: AppConfigurationClient;

    if (options.tokenCredential && options.endpoint) {
        appConfig = new AppConfigurationClient(
            options.endpoint,
            options.tokenCredential,
            options.appConfigOptions);
    } else if (options.appConfigConnectionString) {
        appConfig = new AppConfigurationClient(
            options.appConfigConnectionString,
            options.appConfigOptions);
    } else {
        throw "Invalid arguments";
    }


    const settings = appConfig.listConfigurationSettings({
        labelFilter: options.labelFilter,
    });

    const keyVaultValues: { key: string, uri: URI }[] = [];

    let setting = await settings.next();
    while (setting.done === false) {
        if (setting.value) {
            if (options.includeKeyVaultSecrets === true &&
                setting.value.contentType === "application/vnd.microsoft.appconfig.keyvaultref+json;charset=utf-8" &&
                setting.value.value) {
                // Key Vault settings are stored as uris

                const uri = URI.parse(JSON.parse(setting.value.value).uri);
                keyVaultValues.push({ key: setting.value.key, uri });

            } else {
                process.env[setting.value.key] = setting.value.value;
            }
        }
        setting = await settings.next();
    }

    if (options.includeKeyVaultSecrets && keyVaultValues.length > 0) {
        const credential = new EnvironmentCredential();

        while (keyVaultValues.length != 0) {
            const val = keyVaultValues.pop();
            if (val) {
                const client = new SecretClient(val.uri.scheme + "://" + val.uri.authority, options.tokenCredential ? options.tokenCredential : credential);
                process.env[val.key] = (await client.getSecret(val.uri.path.split("/").pop() as string)).value;
            }
        }
    }
};