# Nodes environment variables with Azure Application Configuration

**azure-env-app-configuration** is a utility library to the *Azure Application Configuration* service, and the *@azure/app-configuration* package, that allows you to easy import configurations into your node environment variables (`process.env`).

## Options

| Option | Description |
|--------|-------------|
|`appConfigConnectionString`*| Connection string to App Config |
|`appConfigOptions` | Options for App Config |
|`endpoint`* | Endpoint for App Config |
|`tokenCredential`*| Credentials to use with `endpoint`|
|`includeKeyVaultSecrets`| Also read connected Key Vault secrets|
|`ignore` | An array of configuration names to ignore |
|`ignoreIfDefined`| An array of configuration names to ignore, if already set|

*) Either use `appConfigConnectionString` or `endpoint`/`tokenCredential`

## Example

Simple configuration that imports all available configurations into `process.env`:

``` TypeScript
import { envAppConfiguration } from "azure-env-app-configuration";
await envAppConfiguration({
    appConfigConnectionString: "..." // Azure Application Configuration connection string
});
```

Just import configurations with the label `env`:

``` TypeScript
import { envAppConfiguration } from "azure-env-app-configuration";
await envAppConfiguration({
    appConfigConnectionString: "...",
    labelFilter: "env"
});
```

Used together with packages such as `dotenv`, where in this case the Azure Application Configuration settings will overwrite any definitions in the local `.env` file:

``` TypeScript
import { envAppConfiguration } from "azure-env-app-configuration";

require("dotenv").config();

await envAppConfiguration({
    appConfigConnectionString: "...",
    labelFilter: "env"
});
```

## Installation

Install it to your solution by using:

``` bash
npm install azure-env-app-configuration --save
```

## About

**azure-env-app-configuration** is created and maintained by [Wictor Wilen](https://www.wictorwilen.se)

## License

MIT
