import React from 'react';
import { Row, Col, Container } from 'reactstrap';
import {
  Card, CardImg, CardText,
  CardBody, CardTitle, CardSubtitle,
  Button, Modal, ModalHeader,
  ModalBody, ModalFooter, Form,
  FormGroup, Label, Input
} from 'reactstrap';
import axios from 'axios';

class Home extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      productId: null,
      products: [],
      isModalOpen: false,
      modalData: {},
      productName: '',
      productPrice: 0,
      productDetail: '',
      productImage: ''
    }
  }
  
  componentDidMount() {
    let args = { code: 1 }
    this.postApi(args)
      .then(({ data }) => {
        if (data.statusCode === "010") {
          if (!data.data.length > 0) {
            args = { code: 0 }
            this.postApi(args)
              .then(({ data }) => this.forceUpdate();)
          }
          this.setState({
            products: data.data
          })
        }else {
          alert(data.statusMessage)
        }
      })
  }
  
  postApi(args) {
    let url = "http://localhost:1999/api/elevenia";
    return axios.post(url, args, {
      headers: { "Content-Type": "application/json;charset=utf-8" }
    })
  }
  
  deleteProduct(id) {
    let args = { code: 3, prdNo: id }
    this.postApi(args)
      .then(({ data }) => {
        if (data.statusCode !== "010") {
          alert(data.statusMessage)
        }
        let args = { code: 1 }
        this.postApi(args)
          .then(({ data }) => {
            if (data.statusCode === "010") {
              this.setState({
                isModalOpen: !this.state.isModalOpen,
                products: data.data
              })
            }else {
              alert(data.statusMessage)
            }
          })
      })
  }
  
  editProduct = (id) => {
    let state = this.state;
    let args = {
      code: 2,
      prdName: state.productName,
      prdPrc: state.productPrice,
      prdImage: state.productImage,
      prdDetail: state.productDetail,
      prdNo: id
    }
    this.postApi(args)
      .then(({ data }) => {
        if (data.statusCode !== "010") {
          alert(data.statusMessage)
        }
        let args = { code: 1 }
        this.postApi(args)
          .then(({ data }) => {
            if (data.statusCode === "010") {
              this.setState({
                isModalOpen: !this.state.isModalOpen,
                products: data.data
              })
            }else {
              alert(data.statusMessage)
            }
          })
      })
  }
  
  showModal(data) {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
      modalData: data,
      productName: data ? data.name : '',
      productPrice: data ? data.selPrc : 0,
      productDetail: data ? data.prdDetail : '',
      productImage: data ? data.prdImage : ''
    })
  }
  
  renderModalProduct() {
    let product = this.state.modalData;
    if (!product) { return null; }
    return (      
      <Modal isOpen={this.state.isModalOpen} toggle={() => this.showModal()} size="lg">
        <Form onSubmit={e => {
          e.preventDefault();
          this.editProduct(product.prdNo);
        }}>
          <ModalHeader toggle={() => this.showModal()}>{product.name}</ModalHeader>
          <ModalBody>
            <Row>
              <Col md="6"><img width="200px" src={product.prdImage} /></Col>
              <Col>
                <FormGroup>
                  <Label for="prdName">Product Name</Label>
                  <Input type="text" name="prdName" id="prdName"
                    value={this.state.productName}
                    onChange={(e) => {
                      this.setState({ productName: e.target.value })
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="prdPrice">Price</Label>
                  <Input type="text" name="prdPrice" id="prdPrice"
                    value={this.state.productPrice}
                    onChange={(e) => {
                      this.setState({ productPrice: e.target.value })
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="prdDetail">Details</Label>
                  <Input type="textarea" name="prdDetail" id="prdDetail"
                    value={this.state.productDetail}
                    onChange={(e) => {
                      this.setState({ productDetail: e.target.value })
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={() => this.deleteProduct(product.prdNo)}>Delete</Button>{' '}
            <Button color="primary" type="submit">Submit Edit</Button>{' '}
            <Button color="secondary" onClick={() => this.showModal()}>Cancel</Button>
          </ModalFooter>
        </Form>
      </Modal>
    )
  }
  
  renderProductList() {
    let { products } = this.state;
    let results = [];
    products.forEach(prd => {
      results.push(
        <Col md="3" style={{ marginTop: "15px" }} key={prd.prdNo}>
          
          <Card onClick={() => this.showModal(prd)}>
            <CardImg top width="5%" src={prd.prdImage} />
            <CardBody>
              <CardTitle><b>{prd.name}</b></CardTitle>
              <CardSubtitle>{prd.selPrc}</CardSubtitle>
            </CardBody>
          </Card>
        </Col>
      )
    })
    return results;
  }
  
  render() {
    return (
      <div>
        <Container>
          <Row>
            {this.renderModalProduct()}
            {this.renderProductList()}
          </Row>
        </Container>
      </div>
    )
  }
  
}
export default Home;