import { ISbStoryData } from 'storyblok-js-client';

/**
 * An abstraction for visited node / object within a storyblok
 * content data structure.
 */
export interface IVisitStoryNode {
    key: string;
    value: any;
    path: string[];
    type: 'component' | 'array' | 'field';
    fieldtype?: string;
    component_id: string; // the component id - ( or nearest component id )
    component_name: string; // the component name - ( or nearest ) ( same as technical name )
    parent?: IVisitStoryNode;
}

export interface IVisitStoryOpts {
    visit: (node: IVisitStoryNode) => void;
}

// @ts-ignore
const isComponent = (obj: any) => Object.hasOwn(obj, '_uid') && Object.hasOwn(obj, 'component');

// @ts-ignore
const isArray = (obj: any) => Object.hasOwn(obj, 'length') && obj instanceof Array;

/**
 *
 * A walk / mapping function to iterate over a storyblok Story content data object.
 * Provide a vistor function to operate on the node in the object. The object can be manipulated
 * if changes to the story need to be made.
 *
 * @param story
 * @param opts
 */
export const visitStory = (story: ISbStoryData, opts: IVisitStoryOpts) => {
    /**
     * Recursive walk function.
     */
    const walkContent = (
        key: string,
        content: ISbStoryData['content'] | any,
        path: string[] = [],
        parent: IVisitStoryNode = null!
    ) => {
        path = [...path, key];

        const $isComponent = isComponent(content);
        const $isArray = isArray(content);
        const $isField = !$isComponent && !$isArray;

        const node: IVisitStoryNode = {
            key,
            type: $isComponent ? 'component' : $isArray ? 'array' : 'field',
            value: content,
            path,
            component_id: $isComponent ? content._uid : parent?.component_id,
            component_name: $isComponent ? content.component : parent?.component_name,
            parent,
            fieldtype: $isField ? content.fieldtype || typeof content : undefined
        };

        // allow visitor to perform op.
        opts.visit(node);

        if ($isComponent || $isArray) {
            /**
             * Traverse all keys/values/arrays
             */
            Object.entries(content)
                .filter(([key]) => ['_editable', '_uid', 'component'].indexOf(key) === -1)
                .forEach(([key, value]) => {
                    walkContent(key, value, path, node);
                });
        }
    };

    walkContent('root', story.content);
};
