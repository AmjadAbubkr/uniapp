let _clipboard: { setString: (text: string) => void; getString: () => Promise<string> } | null = null;

try {
  _clipboard = require('@react-native-clipboard/clipboard').default;
} catch {
  _clipboard = null;
}

export const Clipboard = {
  setString: (text: string) => {
    if (_clipboard) {
      _clipboard.setString(text);
    }
  },
  getString: async (): Promise<string> => {
    if (_clipboard) {
      return _clipboard.getString();
    }
    return '';
  },
};
