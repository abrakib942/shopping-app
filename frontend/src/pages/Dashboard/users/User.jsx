import { useDebounced } from "../../../utils/debounce";
import { Button, Input, message } from "antd";
import { DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import DataTable from "../../../components/DataTable";
import CustomModal from "../../../components/CustomModal";
import { useState } from "react";
import ActionBar from "../../../components/ActionBar";
import {
  useDeleteUserMutation,
  useGetAllUserQuery,
} from "../../../redux/api/userApi";

const Users = () => {
  const query = {};

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [userId, setUserId] = useState("");

  const [deleteUser] = useDeleteUserMutation();

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
  const { data, isLoading } = useGetAllUserQuery({ ...query });

  console.log("data", data);

  const usersData = data?.data.data;
  const meta = data?.data.meta;

  const deleteHandler = async (id) => {
    message.loading("Deleting.....");
    try {
      const res = await deleteUser(id);
      if (res?.data) {
        message.success("User Deleted successfully");

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
      title: "Email",
      dataIndex: "email",
      render: function (data) {
        return <div className="">{data}</div>;
      },
    },
    // {
    //   title: "Password",
    //   dataIndex: "password",
    //   render: function (data) {
    //     return <div className="">{data}</div>;
    //   },
    // },

    {
      title: "Registered_At",
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
            {/* <Link to="">
              <Button
                style={{
                  margin: "0px 5px",
                }}
                type="primary"
              >
                <EditOutlined />
              </Button>
            </Link> */}

            <Button
              onClick={() => {
                setDeleteModal(true);
                setUserId(data);
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
      <ActionBar title={`User List (${meta?.total || 0})`}>
        <Input
          type="text"
          size="large"
          placeholder="Search User Name, Email"
          style={{
            width: "30%",
            marginBottom: 10,
          }}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
        <div>
          {/* <Link to="">
            <CustomButton>Create</CustomButton>
          </Link> */}
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
        dataSource={usersData}
        pageSize={size}
        totalPages={meta?.total}
        showSizeChanger={true}
        onPaginationChange={onPaginationChange}
        onTableChange={onTableChange}
        showPagination={true}
      />

      <CustomModal
        title={`Remove User`}
        isOpen={deleteModal}
        closeModal={() => setDeleteModal(false)}
        handleOk={() => deleteHandler(userId)}
      >
        <p className="my-5">Do you want to remove this User?</p>
      </CustomModal>
    </div>
  );
};
export default Users;
