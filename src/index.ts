// SPDX-License-Identifier: MIT
// Copyright Wictor Wilén 2020

import { AppConfigurationClient, AppConfigurationClientOptions } from "@azure/app-configuration";

/**
 * Options for envAppConfiguration
 */
export declare type Options = {
    /**
     * Azure Application Configuration connection string
     */
    appConfigConnectionString: string;
    /**
     * Azure Application Configuration options
     */
    appConfigOptions?: AppConfigurationClientOptions;
    /**
     * Azure Application Configuration labels that will be imported
     * Up to five labels can be selected, comma separated
     */
    labelFilter?: string;
}

/**
 * Reads configuration from Azure Application Configuration and copies the values
 * into node `process.env` properties
 * @param options Options
 */
export const envAppConfiguration = async (options: Options) => {
    const appConfig = new AppConfigurationClient(
        options.appConfigConnectionString,
        options.appConfigOptions);

    const settings = appConfig.listConfigurationSettings({
        labelFilter: options.labelFilter,
    });

    let setting = await settings.next();
    while (setting.done === false) {
        if (setting.value) {
            process.env[setting.value.key] = setting.value.value;
        }
        setting = await settings.next();
    }
};