import { Link } from "react-router-dom";
import {
  useDeleteItemMutation,
  useGetAllItemsQuery,
} from "../../../redux/api/itemApi";
import { useDebounced } from "../../../utils/debounce";
import { Button, Input, message } from "antd";
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

const Items = () => {
  const query = {};

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [itemId, setItemId] = useState("");

  const [deleteItem] = useDeleteItemMutation();

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

  console.log("data", data);

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
            <CustomButton>Create</CustomButton>
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
