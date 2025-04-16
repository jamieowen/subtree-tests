export function listenToNextResponseEvent<T> ( eventName: string, payloadKey = 'payload' ): Promise<T>
{
    return new Promise<T>( ( resolve, reject ) =>
    {
        function responseHandler ( event: MessageEvent )
        {
            console.info( 'Got a message from the window: ', event );
            if ( typeof event.data === 'string' )
            {
                let response;
                try
                {
                    response = JSON.parse( event.data );
                }
                catch ( error )
                {
                    console.warn( 'Problem parsing message event data: ', error );
                    return;
                }

                // Stop early if it's not the right event type
                if ( response.event !== eventName )
                    return;

                window.removeEventListener( 'message', responseHandler );
                const payload = response[ payloadKey ];

                if ( payload.error )
                {
                    reject( payload );
                    return;
                }

                resolve( payload );
            }
        }

        window.addEventListener( 'message', responseHandler );
    } );
} 