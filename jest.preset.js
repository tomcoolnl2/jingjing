const nxPreset = require('@nx/jest/preset').default;

module.exports = {
    ...nxPreset,
    transform: {
        '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'] }],
    },
};
