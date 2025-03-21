import fs from 'fs';

let url =
  'https://api.storyblok.com/v2/cdn/stories/home?token=Ybr3F0C6OC9jEbjrhAEQNQtt&cv=1688047147&version=draft';

async function main() {
  let resp = await fetch(url);
  let json = await resp.json();

  fs.writeFileSync(
    'src/data/story.json',
    JSON.stringify(json, null, 2),
    'utf8'
  );
}

main();
