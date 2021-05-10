import { generateAcrylic } from './acrylic';

describe('Acrylic tests', () => {
  test('generateAcrylic() function test', () => {
    generateAcrylic(
      'http://localhost:4200/bg-1.jpg',
      (image) => {
        console.log(image);
      },
      '#2f82ff',
      0.8
    );
  });
});
