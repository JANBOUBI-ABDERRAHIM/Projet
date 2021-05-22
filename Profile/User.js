import React from 'react';
import { Text, View, StyleSheet, FlatList, ImageBackground } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

export default function User( { route , navigation} ){
    const { nom, prenom, phone, email, type } = route.params;
    return(
        <ImageBackground
            source={ require('../3132.jpg') }
            style={Styles.imag}
        >
            <Feather name='arrow-left' size={35} style={{position:'absolute', top: 10, left: 10}} onPress={ () => navigation.goBack()}/>
            <View style={Styles.body}>
                <Text style={Styles.Title}>{ nom +" "+ prenom }</Text>
                <Text style={Styles.Chef}>Telephone : { phone }</Text>
                <Text style={Styles.Chef}>Email : { email }</Text>
                <Text style={Styles.memTit}>Type : { type }</Text>
            </View>
        </ImageBackground>
    );
}

const Styles = StyleSheet.create({
    body: {
        marginTop: '-70%',
        marginHorizontal: 13,
        padding: '6%',
        // height: 200,
        backgroundColor: '#E5DDEC',
        // flex: 1,
        justifyContent: 'flex-start',
        borderRadius: 10,
        alignContent: 'center',
    },
    Title: {
        fontSize: 22,
        paddingLeft: '35%',
        paddingBottom: 10,
        color: 'red',
    },
    Chef: {
        fontSize: 17,
        color: 'black',
        paddingVertical: 3,
    },
    Member: {
        fontSize: 14,
        paddingLeft: '4%',
        paddingVertical: 2,
    },
    memTit: {
        fontSize: 17,
        color: 'black',
        paddingVertical: 7,
    },
    imag: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
    }
})