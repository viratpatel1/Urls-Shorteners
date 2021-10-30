import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Form, Row, Col, Container, Table } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";

const LocalUrl = "http://localhost:5000/";
const url = "https://urls-shorteners.herokuapp.com/";

export const Urlshort = () =>
{
    const [long, setLong] = useState([]);
    const { register, handleSubmit } = useForm();

    const onSubmit = handleSubmit(async (data) =>
    {
        try
        {
            const { text } = data;
            console.log(text)
            await axios.post(`${url}shortUrl`, { text })
                .then((res) => console.log(res))
                .catch((err) => console.log(err.message))
        } catch (error)
        {
            console.log(error)

        }

    });

    useEffect(() =>
    {
        fetch(`${url}`)
            .then((res) => res.json())
            .then((res) => setLong(res));
    }, [onSubmit])

    return (
        <div>
            <Container>
                <h2>Url Shortener</h2>
                <Form onSubmit={onSubmit} >
                    <Form.Group as={Row} className="my-4" controlId="formGroupEmail">
                        <Col sm="6">
                            <Form.Control {...register("text")} name="text" type="text" placeholder="Enter Url" />
                        </Col>
                        <Form.Label column style={{ margin: "-7px 0 0 0" }} sm="1">
                            <Button onClick={onSubmit} variant="primary">Submit</Button>{' '}
                        </Form.Label>
                    </Form.Group>
                </Form>
                <Table striped bordered hover size="sl">
                    <thead>
                        <tr>
                            {/* <th>#</th> */}
                            <th>Long Url</th>
                            <th>Short Url</th>
                            {/* <th>Click Count</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {long.map((data) =>
                        {
                            const { _id, LongUrl, ShortUrl, ClickCount } = data;
                            return (

                                <tr key={_id}>
                                    {/* <td>1</td> */}
                                    <td><a href={LongUrl} target="_blank">{LongUrl}</a></td>
                                    <td><a href={LongUrl} target="_blank">{ShortUrl}</a></td>
                                    {/* <td>{ClickCount}</td> */}
                                </tr>
                            )
                        }
                        )}
                    </tbody>
                </Table>
            </Container>
        </div>
    )
}
