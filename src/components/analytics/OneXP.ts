import { listenToNextResponseEvent } from "./EventAssistant";

export const isOneXp = () => {
    const params = new URLSearchParams(window.location.search)
    return params.has('onexp')
}

export const resizeWindow = ( height: number | string ) =>
{
    const response = listenToNextResponseEvent<{ message: string; }>( 'resizeWindowResponse' );

    window.parent.postMessage(
        JSON.stringify( {
            event: 'resizeWindow',
            param: JSON.stringify( {
                height
            } ),
        } ),
        '*'
    );

    return response;
};