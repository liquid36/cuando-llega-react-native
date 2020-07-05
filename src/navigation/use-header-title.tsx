import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";

export function useHeaderTitle(initialTitle: string) {
    const [ title, setTitle ] = useState(initialTitle);
    const navigation = useNavigation();

    React.useLayoutEffect(() => {
        navigation.setOptions({
            title 
        });
      }, [navigation, title]);
    return [title, setTitle];
}