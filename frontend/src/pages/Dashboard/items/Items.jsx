import { Link } from "react-router-dom";
import {
  useCreateItemMutation,
  useDeleteItemMutation,
  useGetAllItemsQuery,
  useUpdateItemMutation,
} from "../../../redux/api/itemApi";
import { useDebounced } from "../../../utils/debounce";
import { Button, Form, Input, Modal, message, notification } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import CustomButton from "../../../components/CustomButton";
import DataTable from "../../../components/DataTable";
import CustomModal from "../../../components/CustomModal";
import { useState } from "react";
import ActionBar from "../../../components/ActionBar";
import { getUserInfo } from "../../../utils/authService";

const Items = () => {
  const query = {};

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [addItemModal, setAddItemModal] = useState(false);
  const [editItemModal, setEditItemModal] = useState(false);
  const [itemId, setItemId] = useState("");

  const [deleteItem] = useDeleteItemMutation();
  const [createItem] = useCreateItemMutation();
  const [updateItem] = useUpdateItemMutation();

  query["limit"] = size;
  query["page"] = page;
  query["sortBy"] = sortBy;
  query["sortOrder"] = sortOrder;
  // query["searchTerm"] = searchTerm;

  const debouncedTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (debouncedTerm) {
    query["searchTerm"] = debouncedTerm;
  }
  const { data, isLoading } = useGetAllItemsQuery({ ...query });

  const { userEmail } = getUserInfo();

  const itemsData = data?.data.data;
  const meta = data?.data.meta;

  const deleteHandler = async (id) => {
    message.loading("Deleting.....");
    try {
      const res = await deleteItem(id);
      if (res?.data) {
        message.success("Item Deleted successfully");

        setDeleteModal(false);
      } else {
        message.error("Failed to Delete, try again");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const [form] = Form.useForm();

  //
  const handleAdd = async () => {
    message.loading("Creating.....");
    try {
      const values = await form.validateFields();
      const response = await createItem({ ...values });

      console.log("res", response);

      if (response?.data) {
        notification.success({
          message: "Success",
          description: "Item Created successfully",
        });
        message.success("Item Created successfully");
        form.resetFields();

        setAddItemModal(false);
      } else {
        message.error("Failed to Create, try again");
      }
    } catch (error) {
      message.error(error);
    }
  };

  const handleEdit = async (id) => {
    try {
      const values = await form.validateFields();

      const response = await updateItem({ id: id, data: values });

      if (response?.data) {
        notification.success({
          message: "Success",
          description: "Item updated successfully",
        });
        form.resetFields();
        setEditItemModal(false);
      } else {
        notification.error({
          message: "Error",
          description: "Failed to update item, try again",
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to update item. Please try again.",
      });
    }
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      render: function (data) {
        return <div className="">{data}</div>;
      },
    },
    {
      title: "Created_by",
      dataIndex: "created_by",
      render: function (data) {
        return <div className="">{data?.email}</div>;
      },
    },

    {
      title: "Created_At",
      dataIndex: "createdAt",
      render: function (data) {
        return data && dayjs(data).format("MMM D, YYYY hh:mm A");
      },
      sorter: true,
    },
    {
      title: "Action",
      dataIndex: "id",
      render: function (data) {
        return (
          <>
            <Link to="">
              <Button
                style={{
                  margin: "0px 5px",
                }}
                type="primary"
                onClick={() => {
                  setEditItemModal(true);
                  setItemId(data);
                }}
              >
                <EditOutlined />
              </Button>
            </Link>

            <Button
              onClick={() => {
                setDeleteModal(true);
                setItemId(data);
              }}
              type="primary"
              danger
            >
              <DeleteOutlined />
            </Button>
          </>
        );
      },
    },
  ];

  const onPaginationChange = (page, pageSize) => {
    setPage(page);
    setSize(pageSize);
  };
  const onTableChange = (pagination, filter, sorter) => {
    const { order, field } = sorter;

    setSortBy(field);
    setSortOrder(order === "ascend" ? "asc" : "desc");
  };

  const resetFilters = () => {
    setSortBy("");
    setSortOrder("");
    setSearchTerm("");
  };

  return (
    <div>
      <ActionBar title={`Item List (${meta?.total || 0})`}>
        <Input
          type="text"
          size="large"
          placeholder="Search Item Name"
          style={{
            width: "30%",
            marginBottom: 10,
          }}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
        <div>
          <Link to="">
            <CustomButton
              onClick={() => {
                setAddItemModal(true);
              }}
            >
              Create
            </CustomButton>
          </Link>
          {(!!sortBy || !!sortOrder || !!searchTerm) && (
            <Button
              onClick={resetFilters}
              type="primary"
              style={{ margin: "0px 5px" }}
            >
              <ReloadOutlined />
            </Button>
          )}
        </div>
      </ActionBar>

      <DataTable
        loading={isLoading}
        columns={columns}
        dataSource={itemsData}
        pageSize={size}
        totalPages={meta?.total}
        showSizeChanger={true}
        onPaginationChange={onPaginationChange}
        onTableChange={onTableChange}
        showPagination={true}
      />

      {/* create modal */}

      <Modal
        title={`Add Item`}
        open={addItemModal}
        onCancel={() => {
          setAddItemModal(false);
          form.resetFields();
        }}
        onOk={handleAdd}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Item Name"
            name="name"
            rules={[{ required: true, message: "Please enter the item name!" }]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label="Created_by"
            name="created_by"
            initialValue={userEmail}
            // rules={[{ required: true, message: "Please enter the creator!" }]}
            readOnly
          >
            <Input size="large" readOnly />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit modal */}
      <Modal
        title={`Edit Item - ${
          itemsData && itemsData.find((item) => item.id === itemId)?.name
        }`}
        open={editItemModal}
        onCancel={() => {
          form.resetFields();
          setEditItemModal(false);
        }}
        onOk={() => handleEdit(itemId)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Item Name"
            name="name"
            rules={[{ required: true, message: "Please enter the item name!" }]}
          >
            <Input size="large" />
          </Form.Item>
          {/* <Form.Item
            label="Created_by"
            name="created_by"
            initialValue={userEmail}
            // rules={[{ required: true, message: "Please enter the creator!" }]}
            readOnly
          >
            <Input size="large" readOnly />
          </Form.Item> */}
        </Form>
      </Modal>

      <CustomModal
        title={`Remove Item`}
        isOpen={deleteModal}
        closeModal={() => setDeleteModal(false)}
        handleOk={() => deleteHandler(itemId)}
      >
        <p className="my-5">Do you want to remove this Item?</p>
      </CustomModal>
    </div>
  );
};
export default Items;
