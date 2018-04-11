import React, { Component } from 'react';
import { StyleSheet, View, Modal, Text, Button, Platform, Animated } from 'react-native';
import PropTypes from 'prop-types';
class Message extends Component
{
   constructor()
   {
      super();

      this.animateOpacityValue = new Animated.Value(0);

      this.state = {

        Show: false

      }

      this.ToastMessage = '';
   }

   componentWillUnmount()
   {
      this.timerID && clearTimeout(this.timerID);
   }

   ShowMessageFunction( message = "alert", duration = 1500)
   {
         this.MessageMessage = message;

         this.setState({ ShowMessage: true }, () =>
         {
               Animated.timing
               (
                  this.animateOpacityValue,
                  {
                    toValue: 1,
                    duration: 500
                  }
               ).start(this.HideMessageFunction(duration))
         });

   }

   HideMessageFunction = (duration) =>
   {
      this.timerID = setTimeout(() =>
      {
            Animated.timing
            (
               this.animateOpacityValue,
               {
                 toValue: 0,
                 duration: 500
               }
            ).start(() =>
            {
               this.setState({ ShowMessage: false });
               clearTimeout(this.timerID);
            })
      }, duration);
   }

   render()
   {
      if(this.state.ShowMessage)
      {
         return(

            <Animated.View style = {[ styles.animatedMessageView, { opacity: this.animateOpacityValue, top: (this.props.position == 'top') ? '10%' : '80%', backgroundColor: this.props.backgroundColor }]}>

               <Text numberOfLines = { 1 } style = {[ styles.MessageBoxInsideText, { color: this.props.textColor }]}>{ this.MessageMessage }</Text>

            </Animated.View>

        );
      }
      else
      {
         return null;
      }
   }
}

Message.propTypes = {
  backgroundColor: PropTypes.string,
  position: PropTypes.oneOf([
     'top',
     'bottom'
  ]),
  textColor: PropTypes.string
};

Message.defaultProps =
{
  backgroundColor: '#666666',
  textColor: '#fff'
}
const styles = StyleSheet.create({
    animatedMessageView:
    {
       marginHorizontal: 30,
       paddingHorizontal: 25,
       paddingVertical: 10,
       borderRadius: 25,
       zIndex: 9999,
       position: 'absolute',
       justifyContent: 'center',
       left:0,
       right:0
    },

    MessageBoxInsideText:
    {
       fontSize: 15,
       alignSelf: 'stretch',
       textAlign: 'center'
   }
});

export default Message;
