import React, { useEffect }  from 'react';
import GooglePicker from 'react-google-picker';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  paper_style: {
    display: 'flex',
    flexWrap: 'wrap',
    width: "80%",
    height: '50vh',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
}));

const UploadData = (props) => {

  const classes = useStyles();
  const history = useHistory();
  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      // setState({
      //   ...state, userid: userId
      // })
    } else {
      alert("Login First")
      history.push('/login')
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return(
      <Paper className={classes.paper_style} elevation={3}>
        <GooglePicker clientId={'1056477461369-utg88s08eg6l4j28a90cqra9qlkhp0l0.apps.googleusercontent.com'}
        developerKey={'AIzaSyCAg78ViBCeH-FByeUQ4F6iWzKS3_JUlgc'}
        scope={['https://www.googleapis.com/auth/drive']}
        onChange={data => console.log('on change:', data)}
        onAuthFailed={data => console.log('on auth failed:', data)}
        multiselect={true}
        navHidden={false}
        authImmediate={false}
        viewId={'DOCS'}
        mimeTypes={['image/png', 'image/jpeg', 'image/jpg']}
        createPicker={ (google, oauthToken) => {
          console.log('google gooogle ', google.picker.Action)
          const googleViewId = google.picker.ViewId.DOCS;
          const uploadView = new google.picker.DocsUploadView();
          const docsView = new google.picker.DocsView(googleViewId)
              .setIncludeFolders(true)
              // .setMimeTypes('application/vnd.google-apps.folder')
              .setSelectFolderEnabled(true);

          const picker = new window.google.picker.PickerBuilder()
          // .enableFeature(google.picker.Feature.f4)
          .enableFeature(google.picker.Feature.SIMPLE_UPLOAD_ENABLED)
            .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
              .addView(docsView)
              .addView(uploadView)/*DocsUploadView added*/
              .setOAuthToken(oauthToken)
              .setDeveloperKey('AIzaSyCAg78ViBCeH-FByeUQ4F6iWzKS3_JUlgc')
              .setCallback((data)=>{
                if (data.action === google.picker.Action.PICKED) {
                    var fileId = data.docs[0].id;
                    console.log('The user selected: ' + fileId, data.docs[0].url);
                    alert('copy this link and send to you friends ('+data.docs[0].url+")")
                    // picker
                }
              });
          picker.build().setVisible(true);
      }}>
      <span>
      <Button variant="contained" color="primary">
        Upload Data
      </Button>
      </span>
      <div style={{marginTop: 40}} className="google"></div>
  </GooglePicker>
  </Paper>
    )
}


export default UploadData;