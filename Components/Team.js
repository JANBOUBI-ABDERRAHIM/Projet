import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, BackHandler, ScrollView, Dimensions, TouchableOpacity, Image, RefreshControl,TouchableWithoutFeedback, Keyboard } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { Avatar, Divider, Button } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import AwesomeAlert from 'react-native-awesome-alerts';
import Elevations from 'react-native-elevation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modalbox';
import Swipeout from 'react-native-swipeout';
import { TextInput } from 'react-native-paper';
import { Formik } from 'formik';
import * as yup from 'yup';
import ModalSelector from 'react-native-modal-selector-searchable';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const screen=Dimensions.get('window');

export default function Team( { route, navigation } ){
    const [Alerting, setAlerting] = useState(false);                    const [changeName, setchangeName] = useState(false);
    const [changeChefEquipe, setchangeChefEquipe] = useState(false);    const [changDomaine, setchangDomaine] = useState(false);
    const [refreshing, setRefreshing] = useState(false);                const [chefEq, setchefEq] = useState([]);
    const [dataUser, setdataUser] = useState([]);                       const [dataEquipe, setdataEquipe] = useState([]);
    const [panding1, setpanding1] = useState(true);                     const [panding2, setpanding2] = useState(true);
    const [panding, setpanding] = useState(true);
    const { id, theme, name, C_EQ } = route.params.dataa;
    const onRefresh = React.useCallback(() => { setRefreshing(true); wait(2000).then(() => setRefreshing(false)); functionOfFetching(); }, []);
    const nameModal = [{
        backgroundColor: 'transparent',
        color: '#ff6701',
        component: ( <Button title="Editer" buttonStyle={[Styles.button,{marginTop: '-0.2%'}]} onPress={ () =>{ setchangeName(!changeName) }}/> )
    }];
    const chefModal = [{
        backgroundColor: 'transparent',
        color: '#ff6701',
        component: ( <Button title="Editer" buttonStyle={[Styles.button,{marginTop: '18%'}]} onPress={ () =>{ setchangeChefEquipe(!changeChefEquipe) }}/> )
    }];
    const domainModal = [{
        backgroundColor: 'transparent',
        color: '#ff6701',
        component: ( <Button title="Editer" buttonStyle={[Styles.button,{marginTop: '18%'}]} onPress={ () =>{ setchangDomaine(!changDomaine) }}/> )
    }];
    const bo = route.params.bol;
    const EditEquipe = ( Equipe ) => {
        console.log('Begin of Editing team');
        fetch('http://34.77.153.247:8000/api/Teams/'+id , {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(Equipe)
        }).then( () => functionOfFetching() )
    }
    const EditCompte = ( Compte, id ) => {
        console.log('Begin of Add Editing comtpte');
        fetch('http://34.77.153.247:8000/api/Users/'+id , {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(Compte)
        }).then( () => functionOfFetching() )
    }
    const fun1 = () => {
        setlabels([]);
        for (let i = 0; i < dataEquipe.accounts.length; i++) {
            const element = dataEquipe.accounts[i];
            if( element.type == 'PROF' )            
            setlabels((Last) => {
                return [ { key: element.id, label: element.first_name+" "+element.last_name }, ...Last];
            });
        }
    }
    const fun2 = () => {
        setlabels([]);
        for (let i = 0; i < dataUser.length; i++) {
            const element = dataUser[i];
            if( element.type == 'PROF' && element.team == null )            
            setlabels((Last) => {
                return [ { key: element.id, label: element.first_name+" "+element.last_name }, ...Last];
            });
        }
    }
    const functionOfFetching = () => {
        fetch('http://34.77.153.247:8000/api/Team-Users/'+id)
        .then((response) => response.json())
        .then((json) => setdataEquipe(json))
        .then( () => setpanding(false))
        .catch((error) => console.error(error));
        fetch('http://34.77.153.247:8000/api/Users/')
        .then((response) => response.json())
        .then((json) => setdataUser(json))
        .catch((error) => console.error(error));
    }
    const functionOfChanging = ( idofNEW ) => {
        if( idofNEW != '' && idofNEW != dataEquipe.C_EQ ){
            let a = dataEquipe.C_EQ ;
            EditEquipe({ "C_EQ":idofNEW });
            for (let i = 0; i < dataEquipe.accounts.length; i++) {
                const element = dataEquipe.accounts[i];
                if( element.id == a ){
                    // EditCompte({ "username": element.username, "email": element.email, "first_name": element.first_name, "last_name": element.last_name, "password":"0", "type":"PROF", 'phone': element.phone, 'team': element.team}, element.id);
                    EditCompte({ "username": element.username, "password":"0", "type":"PROF" }, element.id);
                }
                if( element.id == idofNEW ){
                    // EditCompte({ "username": element.username, "email": element.email, "first_name": element.first_name, "last_name": element.last_name, "password":"0", "type":"C_EQ", 'phone': element.phone, 'team': element.team}, element.id);
                    EditCompte({ "username": element.username, "password":"0", "type":"C_EQ" }, element.id);
                }
            }
            functionOfFetching();
        }
    }
    const functionOfAddingMemebre = ( idofNEW ) => {
        console.log("idOfNEW : "+idOfnew);
        if( idofNEW != '' ){
            let a = dataEquipe.id ;
            console.log(" team id : "+a);
            console.log(" data length : "+dataUser.length);
            for (let i = 0; i < dataUser.length; i++) {
                const element = dataUser[i];
                if( element.id == idofNEW ){
                    // EditCompte({ "username": element.username, "email": element.email, "first_name": element.first_name, "last_name": element.last_name, "password":"0", "type":"C_EQ", 'phone': element.phone, 'team': element.team}, element.id);
                    EditCompte({ "username": element.username ,"password":"0", "team": a }, element.id);
                }
            }
            functionOfFetching();
        }
    }
    const [Name, setName] = useState('');
    const [Domaine, setDomaine] = useState('');
    const [labels, setlabels] = useState([]);
    useEffect(() => {
        // BackHandler.addEventListener("hardwareBackPress", function(){navigation.goBack();} ); 
        functionOfFetching();
        // return () => BackHandler.removeEventListener("hardwareBackPress", function(){navigation.goBack();} );
    }, [])
    const IsCorrectName = yup.object({
        name: yup.string().required("Saisir nouvelle nom").min(4).test( (value) => { 'Saisir nouvelle nom', "C'est le meme", setName(value); return Name!=dataEquipe.name ; }),
    });
    const IsCorrectDomaine = yup.object({
        domaine: yup.string().required("Saisir nouvelle nom de domaine").min(4).test( (value) => { 'Saisir nouvelle mumero de domaine' , "C'est le meme", setDomaine(value); return Domaine!=dataEquipe.theme ; }),
    });
    // const [idOfnew, setidOfnew] = useState('');
    let idOfnew = '' ;
    const [addMembers, setaddMembers] = useState(false);
    return(
        <View style={Styles.all}>
            <Modal  style={{width:screen.width-60,height:300,justifyContent:'center',borderRadius: 10,backgroundColor: '#ffc288'}}
                position='center'
                backdrop={true}
                isOpen={changeName}
                onClosed={ () => setchangeName(false)}
            >
                <Formik
                    initialValues={{ name: '' }}      
                    validationSchema={IsCorrectName}
                    onSubmit={ (values, actions) => {
                        // EditEquipe({ "name": Name, "Lab":idOfLabo, "theme":domaineOfEquipe, "creation_DateTime": dcrt, "C_EQ":idChef_Eq});
                        EditEquipe({ "name": Name });
                        actions.resetForm();    functionOfFetching();
                        setchangeName(!changeName);
                        console.log('Name changed');
                        setAlerting(true);
                    }}
                >
                    { props => 
                        <TouchableWithoutFeedback onPress={ () => Keyboard.dismiss() }>
                        <View>
                            <View style={{flexDirection: 'row', width: '100%', marginBottom: '10%', justifyContent: 'center' }}>
                                <Text style={[Styles.title,{color: 'black', marginTop: '2%'}]}>Nom : </Text>
                                <View style={{flexDirection: 'row', marginTop: '2%'}}>
                                <Text style={[Styles.title,{color: '#ff6701'}]}>{ dataEquipe.name }</Text>
                                </View>
                            </View>
                                <View style={Styles.inside}>
                                    <View>
                                        <TextInput selectionColor='#ffc288' color style={Styles.inputNew} label="Nom" mode="outlined" onChangeText={props.handleChange('name')} value={props.values.name} onBlur={ props.handleBlur('name')} />
                                    </View>
                                    <View style={Styles.Errors}><Text style={Styles.errors}>{ props.touched.name && props.errors.name }</Text></View>
                                    <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: "2%"}}>
                                        <Button onPress={ () => { props.handleSubmit(); }} title="Save" buttonStyle={[Styles.button,{marginHorizontal: '8%'}]}/>
                                        <Button onPress={ () => setchangeName(!changeName) } title="Fermer" buttonStyle={Styles.button} />
                                    </View>
                                </View>
                        </View>
                        </TouchableWithoutFeedback>
                    }
                </Formik>
            </Modal>
            <Modal  style={{width:screen.width-60,height:300,justifyContent:'center',borderRadius: 10,backgroundColor: '#ffc288'}}
                position='center'
                backdrop={true}
                isOpen={changDomaine}
                onClosed={ () => setchangDomaine(false)}
            >
                <Formik
                    initialValues={{ domaine: '' }}       validationSchema={IsCorrectDomaine}
                    onSubmit={ ( values, actions ) => {
                        // EditEquipe({ "name":nameOfEquipe, "Lab":idOfLabo, "theme":Domaine, "creation_DateTime": dcrt, "C_EQ":idChef_Eq});
                        EditEquipe({ "theme":Domaine });
                        actions.resetForm();    functionOfFetching();
                        setchangDomaine(!changDomaine);
                        console.log('Domaine changed');
                        setAlerting(true);
                    }}
                >
                    { props => 
                        <TouchableWithoutFeedback onPress={ () => Keyboard.dismiss() }>
                        <View>
                            <View style={{flexDirection: 'row', width: '100%', marginVertical: '10%', justifyContent: 'center' }}>
                                <Text style={[Styles.title,{color: 'black', marginTop: '2%'}]}>Theme : </Text>
                                <View style={{flexDirection: 'row', marginTop: '2%'}}>
                                <Text style={[Styles.title,{color: '#ff6701'}]}>{ dataEquipe.theme }</Text>
                                </View>
                            </View>
                            <View style={Styles.inside}>
                                <View>
                                    <TextInput selectionColor='#ffc288' style={Styles.inputNew} label="Domaine" mode="outlined"  onChangeText={props.handleChange('domaine')} value={props.values.domaine} onBlur={ props.handleBlur('domaine')} />
                                </View>
                                <View style={Styles.Errors}><Text style={Styles.errors}>{ props.touched.domaine && props.errors.domaine }</Text></View>
                                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                    <Button onPress={ () => { props.handleSubmit(); }} title="Save" buttonStyle={[Styles.button,{marginHorizontal: '8%'}]}/>
                                    <Button onPress={ () => setchangDomaine(!changDomaine)} title="Fermer" buttonStyle={Styles.button} />
                                </View>
                            </View>
                        </View>
                        </TouchableWithoutFeedback>
                    }
                </Formik>
            </Modal>
            <Modal  style={{width:screen.width-40,height:200,justifyContent:'center',borderRadius: 10,}}
                position='center'
                entry="top"
                backdrop={true}
                isOpen={changeChefEquipe}
                onClosed={ () => setchangeChefEquipe(false)}
            >
                <TouchableWithoutFeedback onPress={ () => Keyboard.dismiss() }>
                    <View style={{flexDirection:'column'}}>
                        <ModalSelector
                            data={labels}
                            initValue="Cliquer pour selecter un chef d'equipe !"
                            initValueTextStyle={{color: 'red', fontFamily: 'Regular403', fontSize: 14}}
                            style={{backgroundColor: '#ffc288', borderRadius: 6, marginBottom: '10%', marginHorizontal: '2%'}}
                            optionStyle={{backgroundColor: '#fcecdd', marginVertical: '0.8%', borderRadius: 16,}}
                            optionTextStyle={{color: '#ff6701'}}
                            searchStyle={{backgroundColor:'white',paddingVertical: 5, marginBottom: '2%'}}
                            searchText="Choisir un chef d'equipe"
                            cancelStyle={{backgroundColor: '#ff6701', marginHorizontal: '6%'}}
                            cancelTextStyle={{color: '#fcecdd'}}
                            optionContainerStyle={{backgroundColor: '#ffc288', marginHorizontal: '6%'}}
                            onModalOpen={ () => fun1()}      
                            onChange={(option)=>{ idOfnew = option.key }} 
                        />
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <Button onPress={ () =>{ functionOfChanging(idOfnew); setchangeChefEquipe(!changeChefEquipe); }} title="Save" buttonStyle={[Styles.button,{marginHorizontal: '8%'}]}/>
                            <Button onPress={ () => setchangeChefEquipe(!changeChefEquipe)} title="Fermer" buttonStyle={Styles.button} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
            <Modal  style={{width:screen.width-40,height:200,justifyContent:'center',borderRadius: 10,}}
                position='center'
                entry="top"
                backdrop={true}
                isOpen={addMembers}
                onClosed={ () => setaddMembers(false)}
            >
                <TouchableWithoutFeedback onPress={ () => Keyboard.dismiss() }>
                    <View style={{flexDirection:'column'}}>
                        <ModalSelector
                            data={labels}
                            initValue="Cliquer pour ajouter un professeur !"
                            initValueTextStyle={{color: 'red', fontFamily: 'Regular403', fontSize: 14}}
                            style={{backgroundColor: '#ffc288', borderRadius: 6, marginBottom: '10%', marginHorizontal: '2%'}}
                            optionStyle={{backgroundColor: '#fcecdd', marginVertical: '0.8%', borderRadius: 16,}}
                            optionTextStyle={{color: '#ff6701'}}
                            searchStyle={{backgroundColor:'white',paddingVertical: 5, marginBottom: '2%'}}
                            searchText="Choisir un professeur"
                            cancelStyle={{backgroundColor: '#ff6701', marginHorizontal: '6%'}}
                            cancelTextStyle={{color: '#fcecdd'}}
                            optionContainerStyle={{backgroundColor: '#ffc288', marginHorizontal: '6%'}}
                            onModalOpen={ () => fun2()}      
                            onChange={(option)=>{ idOfnew = option.key }} 
                        />
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <Button onPress={ () =>{ functionOfAddingMemebre(idOfnew); setaddMembers(!addMembers) }} title="Save" buttonStyle={[Styles.button,{marginHorizontal: '8%'}]}/>
                            <Button onPress={ () => setaddMembers(!addMembers)} title="Fermer" buttonStyle={Styles.button} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
            <View style={{ marginTop: "12%", marginLeft: "5%", marginBottom: "-125%", paddingBottom: 10, flex: 1, width: '100%'}} >
                <Feather name='arrow-left' color="red" size={38} onPress={ () => navigation.goBack()} />
            </View>
            <View style={Styles.body}>
            { !panding &&
                <KeyboardAwareScrollView refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> } showsVerticalScrollIndicator={false}>
                    <Swipeout right={nameModal} backgroundColor={"transparent"} close autoClose buttonWidth={80} disabled={!bo}>
                        <TouchableOpacity style={{width: '100%'}}>
                            <Text style={Styles.Title}>{ dataEquipe.name }</Text>
                        </TouchableOpacity>
                    </Swipeout>
                    <Divider style={{ height: 1, backgroundColor: '#ffc288' }} />
                    <Swipeout right={chefModal} backgroundColor={"transparent"} close autoClose buttonWidth={80} disabled={!bo}>
                        <TouchableOpacity style={{width: '100%'}}>
                            <Text style={Styles.info}>Chef d'equipe : </Text>
                            { dataEquipe.accounts.map( (item) => dataEquipe.C_EQ==item.id && <Text style={Styles.infos} key={item.id}>{ item.first_name +" "+ item.last_name }</Text> )}
                            </TouchableOpacity>
                    </Swipeout>
                    <Divider style={{ height: 1, backgroundColor: '#ffc288', width: '80%', alignSelf: 'center' }} />
                    <Swipeout right={domainModal} backgroundColor={"transparent"} close autoClose buttonWidth={80} disabled={!bo} >
                        <TouchableOpacity style={{width: '100%'}}>
                            <Text style={Styles.info}>Domaine : </Text>
                            <Text style={Styles.infos}>{ dataEquipe.theme }</Text>
                        </TouchableOpacity>
                    </Swipeout>
                    <Divider style={{ height: 1, backgroundColor: '#ffc288', width: '60%', alignSelf: 'center' }} />
                    <View style={{flexDirection: 'row', justifyContent:'space-between', width: '87%', marginTop: '2%'}}>
                    <Text style={Styles.info}>Les membres d'equipe : </Text>
                    { bo && <Avatar 
                                rounded 
                                // backgroundColor="grey" 
                                size="small" 
                                icon={{name: 'add', color: "red", type: 'Ionicons', size: 30 }} 
                                containerStyle={{ marginRight: "-14%"}} 
                                onPress={ () => setaddMembers(!addMembers)} 
                            >
                            </Avatar> }
                    </View>
                        <View style={{flex: 2, flexDirection: 'column',marginHorizontal:'0%', alignItems:'center'}}>
                        <ScrollView horizontal={true} contentContainerStyle={{paddingHorizontal: '2%'}} showsHorizontalScrollIndicator={false}>
                            { dataEquipe.accounts.map( (item) => 
                                <TouchableOpacity onPress={ () => navigation.navigate("User", item) } key={item.id} style={{marginTop: '1%', marginBottom: '0.8%', flex: 1, width: 220 }}>
                                    <Animatable.View delay={300} animation="slideInRight" style={{flexDirection:'column', paddingVertical: '4%', width: 211, borderRadius: 10, backgroundColor: '#ffc288', ...Elevations[6] }}>
                                            <Image  source= { require('../profile1.png') } style={{ borderRadius: 10, alignSelf: 'center', width: 180, height: 170}}/> 
                                            <Text style={{textAlign: 'center', marginVertical: '9%', fontFamily: 'Regular404', fontSize: 18, color: '#ff6701' }}>{ item.first_name +" "+ item.last_name }</Text>
                                    </Animatable.View>
                                </TouchableOpacity>
                            )}
                            </ScrollView>
                        </View>
                        <AwesomeAlert
                            show={Alerting}                                 title="Updating"
                            message="Update Succesfuly"                      closeOnTouchOutside={true}
                            closeOnHardwareBackPress={true}                showConfirmButton={true}
                            confirmText="Great"                             confirmButtonColor="#DD6B55"
                            onConfirmPressed={() => setAlerting(false) }
                            contentContainerStyle={{backgroundColor: '#fcecdd'}}
                            titleStyle={{ fontFamily: 'Regular404'}}        messageStyle={{ fontFamily: 'Regular403' }}
                        />
                    </KeyboardAwareScrollView>
            }
            </View>
        </View>
    );
}

const Styles = StyleSheet.create({
    all: {
        flex: 1,
        backgroundColor: '#ffc288',
    },
    info: {
        fontSize: 18,
        color: 'black',
        fontFamily: 'Regular404',
        marginLeft: '2%',
        marginTop: '2%'
    },
    infos: {
        marginTop: '1%',
        fontSize: 19,
        color: '#ff6701',
        textAlign: 'center',
        fontFamily: 'Regular404',
        marginBottom: '2%'
    },
    errors: {
        alignSelf: 'flex-end',
        fontSize: 14,
        marginRight: "7%",
        marginVertical: "2%",
        color: '#ff6701',
    },
    body: {

        marginBottom: '4%',
        marginTop: '-4%',
        // marginTop: '2%',
        // marginBottom: '4%',
        marginHorizontal: '3%',
        paddingBottom: '6%',
        paddingTop: '4%',
        paddingHorizontal: '5%',
        // height: 200,
        backgroundColor: '#fcecdd',
        flex: 1,
        justifyContent: 'flex-start',
        borderRadius: 20,
        alignContent: 'center',
    },
    Title: {
        fontSize: 27,
        textAlign: 'center',
        paddingBottom: '0%',
        fontFamily: 'Regular403',
        color: 'red',
        marginTop: '-1%'
    },
    inside: {
        flexDirection: 'column', 
        marginTop: '-4%', 
        marginBottom: '16%', 
        backgroundColor: '#ffc288', 
        padding: '2%', 
        paddingVertical: '4%',
        borderRadius: 10,
        marginHorizontal: '3%',
        ...Elevations[24]
    },
    button: {
        width: 80,
        backgroundColor: '#fea82f',
        borderRadius: 10,
    },
    inputNew: {
        marginHorizontal: "3%", 
        fontSize: 16,
        height: 50,
        backgroundColor: '#fcecdd'
    }
})