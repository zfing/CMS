import React, {useRef} from "react";
import { commonFilter } from "../../../../components/CommonComponent/CommonFunction";
import HasPermi from "../../../../components/CommonComponent/PermissionControl";
import { Row, Col, Tooltip } from "antd";
import PaymentMethed from "./PaymentMethed";

const PaymentConfigInfo = (props) => {
  const { curItem, update } = props;
  const newPaymentRef = useRef()

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <div className="form-title-top">
            Payment Config
            {HasPermi(1001301) && (
              <Tooltip title="Edit">
                <span
                  className="padding-0-5 link-hover-underline:hover"
                  onClick={() => newPaymentRef.current.open()}
                >
                  <i className="fa fa-edit blue table-hover-pointer"></i>
                </span>
              </Tooltip>
            )}
          </div>
        </Col>
      </Row>
      <Row gutter={[8, 8]} className="padding-0-10 basic-information">
        <Col span={4} className="text-semibold">
          ID
        </Col>
        <Col span={8}>{curItem.pay_type}</Col>
        <Col span={4} className="text-semibold">
          PROVIDER
        </Col>
        <Col span={8}>
          {commonFilter("payMethodSupplier", curItem.pay_supplier_id)}
        </Col>
        <Col span={4} className="text-semibold">
          CODE
        </Col>
        <Col span={8}>{curItem.code}</Col>
        <Col span={4} className="text-semibold">
          NAME
        </Col>
        <Col span={8}>{curItem.name}</Col>
        <Col span={4} className="text-semibold">
          COMMISSION FEE
        </Col>
        <Col span={8}>{curItem.commission}</Col>
        <Col span={4} className="text-semibold">
          BASE FEE
        </Col>
        <Col span={8}>{curItem.base_fee}</Col>
        <Col span={4} className="text-semibold">
          CREATE TIME
        </Col>
        <Col span={8}>{commonFilter("fDate", curItem.create_time)}</Col>
        <Col span={4} className="text-semibold">
          USING STATUS
        </Col>
        <Col span={8}>{commonFilter("payMethodStatus", curItem.status)}</Col>
        <Col span={4} className="text-semibold">
          IMG NAME
        </Col>
        <Col span={8}>{curItem.img_name}</Col>
        <Col span={4} className="text-semibold">
          DEFAULT SORT ID
        </Col>
        <Col span={8}>{curItem.default_sort}</Col>
      </Row>
      <PaymentMethed
        curItem={curItem}
        type='edit'
        update={update}
        ref={newPaymentRef}
      />
    </>
  );
};

export default PaymentConfigInfo;
