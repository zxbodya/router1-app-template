// hacky way to pass environment variables rendered in template
// into process.env placeholder generated by webpack

// @ts-ignore
Object.assign(process.env, window.envParams);
