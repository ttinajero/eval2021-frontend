import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Badge, Alert, Form, Button, Modal} from 'react-bootstrap';
import { SiBitcoincash } from 'react-icons/si';
import { RiFileTransferLine } from 'react-icons/ri';
import { BiWallet } from 'react-icons/bi';
const axios = require('axios').default;
var QRCode = require('qrcode.react');
var qs = require('qs');

const Dashboard = () => {

  // WALLET
  const [isLoading, setIsLoading] = useState(true)

  const [balance, setBalance] = useState(0);
  const [received, setReceived] = useState(0);
  const [spent, setSpent] = useState(0);
  const [transaction, setTransaction] = useState(0);
  
  // VALIDATE
  const [validate, setValidate] = useState(false);
  const [txtAddress, setTxtAddress] = useState('');
  const [linkAddress, setLinkAddress] = useState('');

  //SEND
  const [amountSend, setAmountSend] = useState(0.0001);
  const [errSend, setErrSend] = useState(false);
  const [msgSend, setMsgSend] = useState(0);

  //MODAL SAVE ADDRESS
  const [showModal, setShowModal] = useState(false);
  const [modalAlias, setModalAlias] = useState('')
  const [modalAddress, setModalAddress] = useState('')
  const [localValidate, setLocalValidate] = useState(false);
  const [existsLocalAddress, setExistsLocalAddress] = useState('');

  // FUNCTIONS
  const handleClose = () => {setShowModal(false); setModalAlias(''); setModalAddress(''); setLocalValidate(false); setExistsLocalAddress(false)};
  const handleShow = () => {setShowModal(true);  setModalAlias(''); setModalAddress(''); setLocalValidate(false); setExistsLocalAddress(false)};
  
  const sendAmount = async () => {
    if(amountSend > balance) {
      setErrSend(true);
    } else {
      setErrSend(false);
      try {
        const resp = await axios.post('/wallet/trans/'+txtAddress+'/'+amountSend);
        console.log(resp);
        setLinkAddress(txtAddress);
        setMsgSend(1);
        setValidate(false);
        setAmountSend(0.0001);
        setTxtAddress('');
      } catch (err) {
        console.log(err);
        setMsgSend(2);
      }
    }
  }

  const localValidationAddress = async (address) => {
    const resp = await axios.get('/mongo/details/'+address);
    console.log(resp.data);
    if(resp.data) {
        setExistsLocalAddress(<Alert variant="warning" >This address already exists in your catalog.</Alert>);
    } else {
        const val = await axios.post('/wallet/validate/'+address);
        console.log(val.data.data.item.isValid);

        if(val.data.data.item.isValid) {
            console.log('valid, save address');
            const respMongo = await axios.post('/mongo/add/',qs.stringify({ 'alias': modalAlias, 'address': address, 'status': 1 }));
            setExistsLocalAddress(<Alert variant="success" >The address was saved successfully.</Alert>);
        } else {
            console.log('No es valida');
            setExistsLocalAddress(<Alert variant="warning" >This address is not valid.</Alert>);
        }
    }
  }

  const validateAddress = async (address) => {
    try {
      const resp = await axios.post('/wallet/validate/'+address);
      console.log(resp.data.data.item.isValid);
      setValidate(resp.data.data.item.isValid);
      setLinkAddress('');
    } catch (err) {
      console.error(err);
    }
  };

  const sendGetRequest = async () => {
    try {
        const resp = await axios.get('/wallet/tb1qyx86h3tda7t2srl4saq285xzquayvee8ea0yj8');
        const response = resp.data.data.item

        setBalance(response.confirmedBalance.amount);
        setReceived(response.totalReceived.amount);
        setSpent(response.totalSpent.amount);
        setTransaction(response.transactionsCount);

        console.log(resp.data.data.item);
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
  };

  if(validate) {
    var badgeAddress = <Badge bg="success" show={validate}>This address is valid</Badge>;
  } else {
    var badgeAddress = <Badge bg="secondary" show={!validate}>This address is not valid</Badge>;
  }

  useEffect(() => {
    sendGetRequest();
    setIsLoading(false);
  }, [])

  if (isLoading) {
    return <span>Loading...</span>
  }

  return (
    <div><br />
    <Container>
      <Row>
        <Col>
          <Card style={{ width: '100%' }}>
            <Card.Header><SiBitcoincash size={30} color={'Gold'}/> Address: <b>tb1qyx86h3tda7t2srl4saq285xzquayvee8ea0yj8</b>{'  '}<Link to="/details">More info.</Link></Card.Header>
            <Card.Body>
              <Card.Title></Card.Title>
              <Card.Text>
                <Row>
                  <Col> {/* ---------------------------------------------------------------------- */}
                    <div className="card text-center">
                      <Card border="secondary" style={{height:"100px"}}>
                        <Card.Header>BALANCE</Card.Header>
                        <Card.Body>
                          <Card.Title><h3>{balance}</h3></Card.Title>
                        </Card.Body>
                      </Card>
                    </div>
                    <br />
                  </Col> 
                  <Col> {/* ---------------------------------------------------------------------- */}
                  <div className="card text-center">
                    <Card border="secondary" style={{height:"100px"}}>
                      <Card.Header>TOTAL RECEIVED</Card.Header>
                      <Card.Body>
                        <Card.Title><h3>{received}</h3></Card.Title>
                      </Card.Body>
                    </Card>
                    </div>
                    <br />
                  </Col>
                  <Col> {/* ---------------------------------------------------------------------- */}
                  <div className="card text-center">
                    <Card border="secondary" style={{height:"100px"}}>
                      <Card.Header>TOTAL SENT</Card.Header>
                      <Card.Body>
                        <Card.Title><h3>{spent}</h3></Card.Title>
                      </Card.Body>
                    </Card>
                    </div>
                    <br />
                  </Col>
                  <Col> {/* ---------------------------------------------------------------------- */}
                  <div className="card text-center">
                    <Card border="secondary" style={{height:"100px"}}>
                      <Card.Header>TRANSACTION</Card.Header>
                      <Card.Body>
                        <Card.Title><h3>{transaction}</h3></Card.Title>
                      </Card.Body>
                    </Card>
                  </div>
                    <br />
                  </Col>
                  <Col> {/* ---------------------------------------------------------------------- */}
                  <div className="card text-center">
                    <Card border="secondary" style={{height:"100px"}}>
                        <Card.Body>
                          <QRCode value='tb1qyx86h3tda7t2srl4saq285xzquayvee8ea0yj8' size="35" />
                        </Card.Body>
                      </Card>
                  </div>
                    <br />
                  </Col>
              </Row>
              </Card.Text>
            </Card.Body>
            <Card.Footer><Badge bg="secondary">Testnet</Badge></Card.Footer>
          </Card>
          <br />
        </Col>
      </Row>
    </Container>
    <br/>
    <br/>
    <br/>
    <Container>
      <Row>
        <Col>
          <Card style={{ width: '100%' }}>
            <Card.Header>
            <Row>
                <Col><RiFileTransferLine size={30} color={'Blue'} />Transfer</Col>
                <Col md="auto"></Col>
                <Col xs lg="2">
                <Button variant='primary' onClick={handleShow}>Save new Address</Button>
                </Col>
            </Row>
                
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group controlId="formBasicEmail">
                <Form.Label>Amount</Form.Label>
                  <Form.Control type="input" placeholder="0.00" value={amountSend} onChange={e => {setAmountSend(e.target.value)}} /><br/>
                  <Form.Label>Address</Form.Label>
                  <Form.Control type="input" placeholder="Enter address" value={txtAddress} onChange={e => {setTxtAddress(e.target.value);setValidate(false)}} /><br/>
                  <Alert variant="warning" show={errSend}>
                    The amount to send is greater than your balance.
                  </Alert>                  
                  <Button variant="primary" type="button" disabled={!validate} onClick={sendAmount} >Send</Button>{' '}
                  <Button variant="outline-success"disabled={validate} onClick={() => validateAddress(txtAddress)}>Validate</Button><br/><br/>
                  {(() => {
                    if (msgSend == 1) {
                      return <Alert variant="success" >The shipment was registered correctly. You can check this transaction in this <a target="_blank" href={"https://live.blockcypher.com/btc-testnet/address/"+linkAddress+"/"}>link</a>.</Alert>;
                    } else if (msgSend == 2) {
                      return <Alert variant="warning" >Something went wrong.</Alert>;
                    } else {
                      return <></>
                    }
                  })()}
                </Form.Group>
              </Form>
            </Card.Body>
            <Card.Footer>
              <Badge bg="secondary">Testnet</Badge>{' '}
              {badgeAddress}
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>

    <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Add Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Alias</Form.Label>
                    <Form.Control type="input" placeholder="John address" value={modalAlias} onChange={e => {setModalAlias(e.target.value)}} /><br/>
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="input" placeholder="Enter address" value={modalAddress} onChange={e => {setModalAddress(e.target.value)}} /><br/>
                    {existsLocalAddress}
                    
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" onClick={() => localValidationAddress(modalAddress)}>Save</Button><br/><br/>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
    </Modal>

    </div>
  )
}

export default Dashboard
