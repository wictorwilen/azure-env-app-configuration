# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2021-01-11

### Fixed

- If `includeKeyVaultSecrets` is set to `false` settings with Key Vault references is no longer added (previously the KV reference was added, but not resolved)

## [1.2.0] - 2020-09-24

### Added

- Added support for managed identities

## [1.1.0] - 2020-08-30

### Added

- Added support for linked Azure Key Vault secrets

## [1.0.0] - 2020-08-27

### Added

- Initial release
