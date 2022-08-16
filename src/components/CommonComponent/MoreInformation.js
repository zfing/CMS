import React from "react";
import { Row, Col } from "antd";

const MoreInformation = (props) => {
  return (
    <div className={`expanded-table default-font gray ${props.marginBottom ? 'margin-bottom-5' : 'margin-0'}`}>
      {props.title && (
        <Row gutter={[24, 8]} className="table-expandable-title ">
          <Col>{props.title}</Col>
        </Row>
      )}
      <Row gutter={[24, 8]} className="margin-0-20">
        {props.objectArr.map(
          (selObj) =>
            !selObj.hidden && (
              <Col
                key={`${selObj.t}expanded_key`}
                className="moreInformation-box"
                span={selObj.position === 2 ? 24 : (selObj.position === 3 ? 8 : 12)}
              >
                <Col
                  span={
                    selObj.title_width
                      ? selObj.title_width
                      : selObj.position === 2
                      ? 3
                      : selObj.position === 3 
                      ? 10
                      : 6
                  }
                  className="expand-table-title"
                >
                  {selObj.t}
                </Col>
                <Col
                  span={
                    selObj.title_width
                      ? 24 - selObj.title_width
                      : selObj.position === 2
                      ? 21
                      : selObj.position === 3 
                      ? 14
                      : 18
                  }
                  className="world-break-break-all"
                >
                  {selObj.v}
                </Col>
              </Col>
            )
        )}
      </Row>
    </div>
  );
};
export default MoreInformation;
