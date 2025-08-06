import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import FullCalendarPage from './FullCalendarPage'
import Weather from './Weather';

const Schedule = () => {
    let mem_id = window.sessionStorage.getItem('mem_id');
    return (
      <Container className='my-5'>
        {/* <Row>
            <Col>
                <Weather/>
            </Col>
        </Row> */}
          <Row>
              <Col className='my-3' >
                  <FullCalendarPage mem_id={mem_id}/>
              </Col>
          </Row>
      </Container>
    )
}

export default Schedule