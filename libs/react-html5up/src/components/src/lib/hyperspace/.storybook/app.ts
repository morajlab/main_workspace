export const StoryGroups = () => ({
  UIComponents(name: string) {
    return `Components/${name}`;
  },
  Docs() {
    return {
      GettingStarted(name: string) {
        return `Docs/Getting Started/${name}`;
      },
    };
  },
});
