import React from 'react';
import { 
  Flex, 
  Input, 
  DatePicker, 
  Select, 
  Button, 
  Divider,
  Form
} from 'antd';
import styled from 'styled-components';
import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const StyledFormItem = styled(Form.Item)`
  && .ant-form-item-label {
    padding: 0;
  },
  {
    margin-bottom:0;
  }
`;

const SELECT_TYPE_OPTIONS = [
  {value: 'OTPYSK', label: 'Отпуск'},
  {value: 'STAJIROVKA', label: 'Стажировка'},
  {value: 'PRODLENIE_OTPYSKA', label: 'Продление'},
  {value: 'KOMANDIROVKA', label: 'Командировка'},
  {value: 'UCHEBA', label: 'Учеба'},
  {value: 'DEKRET', label: 'Декрет'},
]
const SELECT_STATUS_OPTIONS = [
  {value: true, label: 'Выполняется'},
  {value: false, label: 'Ожидание'},
]
const SELECT_ACTION_ONETIME_OPTIONS = [
  {value: true, label: 'Включить'},
  {value: false, label: 'Выключить'},
]
const FilterComponent = ({ onChange, onReset, selectedKey }) => {
  const [form] = Form.useForm();

  const isDisableItem = () => {
    return selectedKey === '3' ? true : false;
  }

  const onFinish = (values) => {
    const filtered = Object.entries(values)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .reduce((acc, [k, v]) => {
        if (k === 'date') {
          if (selectedKey === '3') {
            acc[k] = { gte: dayjs(v[0]).startOf('day'), lte: dayjs(v[1]).endOf('day') }
          } else {
            // Преобразуем поле 'date' в 'startDate' и 'endDate'
            acc.startDate = { gte: dayjs(v[0]).startOf('day') };
            acc.endDate = { lte: dayjs(v[1]).endOf('day') };
          }
        } else if (k === 'createdAt' || k === 'updatedAt') {
          acc[k] = { gte: dayjs(v[0]).startOf('day'), lte: dayjs(v[1]).endOf('day') };
        } else if (k === 'type' || typeof v === 'boolean') {
          acc[k] = v;
        } else if (k === 'startDate') {
          acc[k] = {gte:dayjs(v).startOf('day'), lte:dayjs(v).endOf('day')}
        } else if (k === 'endDate') {
          acc[k] = {gte:dayjs(v).startOf('day'), lte:dayjs(v).endOf('day')}
        } else {
          // Для остальных строковых полей используем 'contains'
          acc[k] = { contains: v };
        }
        return acc;
      }, {});
    console.log(filtered);
    onChange(filtered);
  }

  return (
    <Form
      name="filter-archive-data"
      onFinish={onFinish}
      size='small'
      form={form}
      style={{marginTop:'10px'}}
    >
      <Flex vertical gap={5}>
        <StyledFormItem
          layout="vertical"
          name="fio"
        >
          <Input title='Впишите ФИО искомого' placeholder='ФИО...' allowClear/>
        </StyledFormItem>

        <StyledFormItem
          layout="vertical"
          name="login"
        >
          <Input placeholder='Логин...' allowClear title="Впишите Логин искомого"/>
        </StyledFormItem>

        <StyledFormItem
          layout="vertical"
          name="order"
        >
          <Input disabled={isDisableItem()} placeholder='Приказ...' allowClear title="Впишите искомый Приказ"/>
        </StyledFormItem>

        <StyledFormItem
          layout="vertical"
          name="status"
        >
          <Select disabled={selectedKey === '3' ? true : false} placeholder="Статус..." options={SELECT_STATUS_OPTIONS} allowClear title="Выберите статус задачи"/>
        </StyledFormItem>

        <StyledFormItem
          layout="vertical"
          name="type"
        >
          <Select disabled={selectedKey === '3' || selectedKey === '2' ? true : false} placeholder="Тип задачи..." options={SELECT_TYPE_OPTIONS} allowClear title="Выберите тип задачи Расписания"/>
        </StyledFormItem>

        <StyledFormItem
          layout="vertical"
          name="state"
        >
          <Select disabled={selectedKey === '1' || selectedKey === '2' ? true : false} placeholder="Действие..." options={SELECT_ACTION_ONETIME_OPTIONS} allowClear title="Выберите выполнение разовой задачи"/>
        </StyledFormItem>
        {/*  */}
        <StyledFormItem
          layout="vertical"
          name="date"
          title="Список задач, которые попадают в этот диапазон"
        >
          <RangePicker format={"DD.MM.YYYY"} allowClear/>
        </StyledFormItem>
        {/*  */}
        <Flex gap={1}>
          <StyledFormItem
            layout="vertical"
            name="startDate"
            title="Список задач, которые строго начинаются с этой даты"
          >
            <DatePicker disabled={isDisableItem()} format={"DD.MM.YYYY"} placeholder='Дата с' allowClear/>
          </StyledFormItem>
          <StyledFormItem
            layout="vertical"
            name="endDate"
            title="Список задач, которые строго заканчиваются на эту дату"
          >
            <DatePicker disabled={isDisableItem()} format={"DD.MM.YYYY"} placeholder='Дата по' allowClear/>
          </StyledFormItem>
        </Flex>

        <Divider style={{margin:5}}></Divider>

        <StyledFormItem
          layout="vertical"
          name="createdBy"
        >
          <Input placeholder='Кем создана...' allowClear title="Кем создана запись"/>
        </StyledFormItem>

        <StyledFormItem
          layout="vertical"
          name="createdAt"
        >
          <RangePicker format={"DD.MM.YYYY"} placeholder='Когда создана...' allowClear title="Когда создана запись"/>
        </StyledFormItem>

        <StyledFormItem
          layout="vertical"
          name="updatedBy"
        >
          <Input placeholder='Кем изменена...' allowClear title="Кем изменена запись"/>
        </StyledFormItem>

        <StyledFormItem
          layout="vertical"
          name="updatedAt"
        >
          <RangePicker format={"DD.MM.YYYY"} placeholder='Когда изменена...' allowClear title="Когда изменена запись"/>
        </StyledFormItem>

        <StyledFormItem
          layout="vertical"
          name="descriptions"
        >
          <Input placeholder='Описание...' allowClear title="Описание"/>
        </StyledFormItem>

      </Flex>
      <Divider></Divider>
      <Flex gap={5} style={{marginTop:'10px'}}>
        <Button size='small' block type="primary" htmlType="submit" icon={<FilterOutlined />}>Применить</Button>
        <Button size='small' block onClick={()=>{form.resetFields(); onReset();}} icon={<ReloadOutlined />}>Сбросить</Button>
      </Flex>
    </Form>
  );
};

export default FilterComponent;