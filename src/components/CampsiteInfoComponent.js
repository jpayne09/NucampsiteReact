import { Component, useState } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem,
     Button, Modal, ModalHeader, ModalBody,FormGroup} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors} from 'react-redux-form';
import {Loading } from './LoadingComponent';
import {baseUrl} from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger} from 'react-animation-components';

function RenderCampsite({campsite}){

    return(
        <div className="col-md-5 m-1">
            <FadeTransform
                in
                transformProps={{
                    exitTransform: 'scale(0.5) translateY(-50%)'
                }}>
                <Card>
                    <CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
                    <CardBody>
                        <CardText>{campsite.description}</CardText>
                    </CardBody>
                </Card>
            </FadeTransform>
        </div>
    );
}

function RenderComments({comments,postComment, campsiteId}){
    if(comments){
        return (
            <div className="col-md-5 m-1">
                <h4>Comments</h4>
                <Stagger in>
                {
                    comments.map(comment => {
                        return (
                            <Fade in key={comment.id}>
                                <div>
                                    <p>
                                        {comment.text}<br />
                                        -- {comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}
                                    </p>
                                </div>
                            </Fade>
                        );
                    })  
                }
                </Stagger> 
            </div>
        );
    }
    return <div />
}


function CampsiteInfo(props) {
    if(props.isLoading){
        return (
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    }
    if(props.errMess){
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            </div>
        );
    }
        if(props.campsite){
            return (
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <Breadcrumb>
                                <BreadcrumbItem><Link to="/directory">Directory</Link></BreadcrumbItem>
                                <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
                            </Breadcrumb>
                            <h2>{props.campsite.name}</h2>
                            <hr />
                        </div>
                    </div>
                    <div className="row">
                        <RenderCampsite campsite={props.campsite} />
                        <RenderComments comments={props.comments} 
                            postComment={props.postComment}
                            campsiteId={props.campsite.id}
                        />
                    </div>
                </div>
            );
        }
        return <div />
    
}


class CommentForm extends Component {
    constructor(props){
        super(props);

        this.state = {
            rating: '',
            author: '',
            text: '',
            isModalOpen: false,
            touched: {
                rating: false,
                author: false,
                text: false
            }
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
    }

    validate(author){
        const errors ={
            author: ''
        }

        if(this.state.touched.author){
            if(author < 2){
                errors.author = "Must beat least 2 characters";
            }else if(author > 15){
                errors.author = "Characters need to be less than 15";
            }
        }
    }
    toggleModal() {
        this.setState({
          isModalOpen: !this.state.isModalOpen
        });
      }
    
      handleSubmit(values) {
        this.toggleModal();
        this.props.postComment(this.props.campsiteId, values.rating, values.author, values.text);

      }
    render() {
        const required = val => val && val.length;
        const maxLength = len => val => !val || (val.length <= len);
        const minLength = len => val => val && (val.length >= len);

        return (
            <div>
                <Button outline onClick={this.toggleModal}>
                    <i class="fa fa-pencil fa-lg" aria-hidden="true"></i> Submit Comment
                </Button>
                <Modal isOpen={this.state.isModalOpen}>
                    <ModalHeader>Submit Comments</ModalHeader>
                        <ModalBody>
                            <LocalForm 
                            onSubmit={values => this.handleSubmit(values)}>
                                <FormGroup>
                                    <label htmlFor=".rating">Rating</label>
                                    <Control.select className="form-control" model=".rating" id="rating" name="rating"
                                
                                    >
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                    
                                    </Control.select>
                            
                                </FormGroup>
                                <FormGroup>
                                    <label htmlFor=".author">Your Name</label>
                                    <Control.text className="form-control" model=".author" id="author" name="author"
                                             validators = {{
                                                required,
                                                minLength: minLength(2),
                                                maxLength: maxLength(15)
                                            }}
                                    />
                                     <Errors
                                                className="text-danger"
                                                model=".author"
                                                show="touched"
                                                component="div"
                                                messages={{
                                                    required: 'Required',
                                                    minLength: 'Must be at least 2 characters',
                                                    maxLength: 'Must be 15 characters or less'
                                                }}
                                        />
                                </FormGroup>
                                <FormGroup>
                                    <label htmlFor=".text">Comment</label>
                                    <Control.textarea className="form-control" rows="6" model=".text" id="text" name="text" />
                                </FormGroup>
                                    <Button type="submit" value="submit" color="primary">Submit</Button> 
                            </LocalForm>
                        </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default CampsiteInfo;