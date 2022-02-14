import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Button, Table, ButtonGroup} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { MdDeleteForever } from 'react-icons/md';
import { BiDetail } from 'react-icons/bi';
import { FiSend } from 'react-icons/fi';
const axios = require('axios').default;
var QRCode = require('qrcode.react');

const Details = () => {

  const [listAddress, setListAddress] = useState([]);
  
  const [showDetail, setShowDetail] = useState(false);
  const [balance, setBalance] = useState(0);
  const [received, setReceived] = useState(0);
  const [spent, setSpent] = useState(0);
  const [transaction, setTransaction] = useState(0);
  const [qrAddress, setQrAddress] = useState('');

  const getListAddress = async () => {
    const resp = await axios.get('/mongo/all');
    console.log(resp.data);

    if(resp.data) {
      setListAddress(resp.data);
    }
  }


  const getAddressDetail = async (address) => {
    try {
      const resp = await axios.get('/wallet/'+address);
      const response = resp.data.data.item

      setBalance(response.confirmedBalance.amount);
      setReceived(response.totalReceived.amount);
      setSpent(response.totalSpent.amount);
      setTransaction(response.transactionsCount);
      setQrAddress(address);

      setShowDetail(true);
      console.log(resp.data.data.item);
  } catch (err) {
      // Handle Error Here
      console.error(err);
  }
  }

  useEffect(() => {
    getListAddress();
  },[])


  return (
    <>
    <Container>
       <Row>
        <Col>
        <Link to="/"><Button variant='link'>
              Back 
            </Button>
        </Link>
        </Col>
      </Row>
    </Container>
    <Container>
       <Row>
        <Col> {/* ---------------------------------------------------------------------- */}
        <br/>
        <br/>
        <Card>
          <Card.Header>Address list</Card.Header>
          <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Alias</th>
                <th>Address</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
            {listAddress.map(function(item, i){
              return <tr key={i}>
                      <td>{item.alias}</td>
                      <td>{item.address}</td>
                      <td>
                      <ButtonGroup size="sm">
                        <Button variant="secondary" onClick={() => getAddressDetail(item.address) }><BiDetail size={'20'} /></Button>
                        <Button variant="primary" disabled={'True'}><FiSend size={'20'} /></Button>
                        <Button variant="danger" disabled={'True'}><MdDeleteForever size={'20'} /></Button>
                      </ButtonGroup>
                      </td>
                    </tr>
            })}
            </tbody>
          </Table>
          </Card.Body>
          <Card.Footer>
          </Card.Footer>
        </Card>
        </Col>
        <Col>{/* ---------------------------------------------------------------------- */}
          <br/>
          <br/>
        <Card>
          <Card.Header>Address details</Card.Header>
          <Card.Body>
            <div>
            {(() => {
              if (showDetail) {
                return <>
                  <Table>
                    <tbody>
                      <tr>
                        <td>BALANCE</td>
                        <td>{balance}</td>
                      </tr>
                      <tr>
                        <td>TOTAL RECEIVED</td>
                        <td>{received}</td>
                      </tr>
                      <tr>
                        <td>TOTAL SENT</td>
                        <td>{spent}</td>
                      </tr>
                      <tr>
                        <td>TRANSACTION</td>
                        <td>{transaction}</td>
                      </tr>
                      <tr>
                        <td>QR</td>
                        <td><QRCode value={qrAddress} size={'50'} /></td>
                      </tr>
                    </tbody>
                  </Table>
                </>
              } else {
                return <>
                
                </>
              }
            })()}
            </div>
          </Card.Body>
        </Card>
        </Col>
      </Row>
    </Container>
    </>
  )
}

export default Details