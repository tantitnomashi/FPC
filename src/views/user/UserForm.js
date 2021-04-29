import React, { useState, useEffect } from 'react';
import { Button, Form, FormControl, Row, Col } from 'react-bootstrap';
import { TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Switch } from '@material-ui/core';
import API from '../../utils/adminApi'
import { NotificationManager } from 'react-notifications';

export default function UserForm(props) {
  const { open, handleClickClose, currentProfile, reload } = props;
  console.log(currentProfile);
  const [toggle, setToggle] = React.useState({
    checkedA: true,
    isActive: true,
  });

  const [validated, setValidated] = useState(false);

  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAdress] = useState('');
  const [pass, setPass] = useState('');
  const [repass, setRepass] = useState('');





  const handleChange = (event) => {
    setToggle({ ...toggle, [event.target.name]: event.target.checked });
  };
  const submitForm = () => {
    let tmp = {
      fullName: name,
      email: email,
      userName: userName,
      phoneNumber: phone,
      password: pass,
      roleId: parseInt(document.getElementById('role-input').value),
      address: address,
      isActive: toggle.isActive
    }
    console.log("#####");
    console.log(tmp);
    console.log("#####");


    API.createUser(tmp).then((response) => {
      if (response.data.statusCode == 200) {
        NotificationManager.success('Create user successfully !', 'Create User');
        reload();
      } else {
        NotificationManager.error('Sorry, Cannot get users list !', 'Create User');
      }

    }).catch(e => NotificationManager.error('Sorry, Cannot get users list !', 'Create User'));

    handleClickClose();
  }

  return (
    <div>

      <Dialog maxWidth={'md'} fullWidth={true} className="dialog-userForm " open={open} onClose={handleClickClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{currentProfile ? "Update" : "Create Account"}</DialogTitle>
        <Form noValidate validated={validated} onSubmit={(e) => {
          const form = e.currentTarget;
          e.preventDefault();
          e.stopPropagation();
          if (form.checkValidity() === false) {
          } else {
            submitForm();
          }
          setValidated(true);

        }

        }>  <DialogContent className='w-100' >
            <DialogContentText  >
              To {currentProfile ? "update" : "create"} User, please fill all fields below.
              </DialogContentText>


            <Row className='w-100' >

              {/* Left part of the Create User Form */}

              <Col xl={(currentProfile ? 12 : 6)}>
                <Form.Group controlId="validationName">
                  <Form.Label column lg={12}>Name </Form.Label>
                  <Form.Control className="my-1" autoFocus id="name" name="name" value={currentProfile?.fullName}
                    label="Name" fullWidth
                    type="Text" placeholder="" required={true} disabled={(currentProfile)}
                    onChange={(e) => {
                      let text = e.target.value;
                      setName(text)
                    }}

                  />
                  <Form.Control.Feedback type="invalid">
                    Please input username, 8 - 50 characters.
                  </Form.Control.Feedback>

                  <Form.Label column lg={12}>Email </Form.Label>
                  <Form.Control className="my-1" id="email"
                    label="Email"
                    type="email"
                    onChange={(e) => {
                      let text = e.target.value;
                      setEmail(text)
                    }}
                    value={currentProfile?.email} disabled={(currentProfile)}
                    required={true} />
                  <Form.Control.Feedback type="invalid">
                    Please input a valid email.
                  </Form.Control.Feedback>


                  <Form.Label column lg={12}>Phone Number </Form.Label>
                  <Form.Control className="my-1" id="phone"
                    type="text"
                    onChange={(e) => {
                      let text = e.target.value;
                      setPhone(text)
                    }}
                    value={currentProfile?.phoneNumber} required={true} />
                  <Form.Control.Feedback type="invalid">
                    Please input a valid phone number.
                  </Form.Control.Feedback>




                  <Form.Label column lg={12}>Address </Form.Label>
                  <Form.Control className="my-1" id="address"
                    type="text"
                    onChange={(e) => {
                      let text = e.target.value;
                      setAdress(text)
                    }}
                    value={currentProfile?.address} required={true} />
                  <Form.Control.Feedback type="invalid">
                    Address is required.
                  </Form.Control.Feedback>
                </Form.Group>

              </Col>


              {/* Right part of the Create User Form */}
              {(!currentProfile) &&
                <Col xl={6}>
                  <Form.Group controlId="validate2">

                    <Form.Label column lg={12}>Username </Form.Label>
                    <Form.Control className="my-1" id="username" name="username"
                      type="text" disabled={currentProfile ? true : false}
                      value={currentProfile?.userName} required={true}
                      onChange={(e) => {
                        let text = e.target.value;
                        setUserName(text)
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      Password is required.
                  </Form.Control.Feedback>


                    <Form.Label column lg={12}>Password </Form.Label>
                    <Form.Control className="my-1" id="password" name="password"
                      type="password" required={true}
                      onChange={(e) => {
                        let text = e.target.value;
                        setPass(text)
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      Re-pass is required.
                  </Form.Control.Feedback>

                    <Form.Label column lg={12}> Re Password </Form.Label>
                    <Form.Control className="my-1" id="re-password" name="re-password"
                      type="password" required={true}

                    />

                    <Form.Label column lg={12}>Role</Form.Label>
                    <Form.Control as="select" custom id="role-input" >

                      <option selected value={1}>Admin</option>
                      <option value={2}>Staff</option>
                    </Form.Control>
                    <Form.Label column lg={12}> Active </Form.Label>
                    <Switch
                      checked={toggle.isActive}
                      onChange={handleChange}
                      color="primary"
                      name="isActive"
                      disabled={false}
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                  </Form.Group>

                </Col>}
            </Row>

          </DialogContent>
          {(!currentProfile) &&
            <div>
              <DialogActions>
                <Button onClick={() => {
                  handleClickClose();
                  setValidated(false);
                }} variant="secondary">
                  Cancel
              </Button>

                <Button className='px-4'
                  type="submit"
                  color="primary">
                  Save
              </Button>
              </DialogActions></div>
          }
        </Form>
      </Dialog>

    </div>
  );
}
