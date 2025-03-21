import { ISbStoryData } from 'storyblok-js-client';
import { visitStory } from './story-visitor';

export const createTranslationFieldMap = (story: ISbStoryData) => {
    const map = new Map<string, string>();

    visitStory(story, {
        visit: (node) => {
            if (node.type == 'field') {
                const key = [node.component_id, node.component_name, node.key].join(':');
                console.log(key);

                // translate rich text ??
                map.set(key, node.value);
            }
        }
    });

    return map;
};
