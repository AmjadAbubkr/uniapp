module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@core': './src/core',
          '@data': './src/data',
          '@domain': './src/domain',
          '@store': './src/store',
          '@screens': './src/screens',
          '@components': './src/components',
          '@navigation': './src/navigation',
        },
      },
    ],
  ],
};
