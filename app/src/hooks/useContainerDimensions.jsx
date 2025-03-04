import { useState } from "react"

export const useContainerDimensions = () => {
    const [containerDimensions, setContainerDimensions] = useState(null);

    const onContianerLayout = event => {
        const {width, height} = event.nativeEvent.layout;
        setContainerDimensions({width, height})
    };

    return {containerDimensions, onContianerLayout}
}