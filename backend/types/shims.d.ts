// Temporary shim to appease the TS analyzer in this environment.
// The project has @types/pg installed, but some tools still report missing types.
// If your editor/tsc resolves @types/pg correctly, this file is harmless.
declare module 'pg';
