import { writeFileSync } from 'fs';

function writeText() {
  const content = 'Test content!';

  try {
    writeFileSync('./test.txt', content);
    console.log('Success!');
  } catch (err) {
    console.error(err);
  }
}

export { writeText };
