import Layout from "@/components/Layout";
import Paginate from "@/components/Paginate";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function UsersPage({ swal }) {
  const [email, setEmail] = useState("");
  const [usersAdmin, setUsersAdmin] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [page, setPage] = useState(1);
  const [disabledButton, setDisabledButton] = useState(false);

  useEffect(() => {
    fetchAdmins();
    fetchUsers();
  }, []);

  function fetchUsers() {
    let data = `?page=${page}`;
    if (searchEmail) {
      data += "&&email=" + searchEmail;
    }
    axios
      .get("/api/users" + data)
      .then((res) => {
        if (!res.data.length) {
          setPage(page - 1);
          setDisabledButton(false);
        } else {
          setUsers(res.data);
          setDisabledButton(false);
        }
      })
      .catch((error) => console.log(error));
  }

  function fetchAdmins() {
    axios
      .get("/api/admins")
      .then((res) => {
        setUsersAdmin(res.data);
      })
      .catch((error) => console.log(error));
  }

  async function submitAdmin() {
    const data = { email };
    if (email) {
      await axios.post("/api/admins", data);
    }
  }

  function deleteUser(user) {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete ${user.email}?`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, delete!",
        confirmButtonColor: "#d55",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = user;
          await axios.delete("/api/admins?_id=" + _id);
          fetchAdmins();
        }
      });
  }

  function banUser(user) {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to ban ${user.email}?`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, ban!",
        confirmButtonColor: "#d55",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id, ban } = user;
          const data = { _id, ban: !ban };
          await axios.put("/api/users", data);
          fetchUsers();
        }
      });
  }

  return (
    <>
      <Layout>
        <div>
          <h1>Admins</h1>
          <label>Add new admin</label>
          <div>
            <form onSubmit={submitAdmin}>
              <input
                onChange={(ev) => setEmail(ev.target.value)}
                value={email}
                type="text"
                placeholder="email"
              />
              <button className="btn-default mt-1 ">New admin</button>
            </form>
          </div>
          <div>
            <table className="basic mt-4">
              <thead>
                <tr>
                  <td>Admin email</td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                {!!usersAdmin.length &&
                  usersAdmin.map((user) => (
                    <tr key={user._id}>
                      <td>{user.email}</td>
                      <td>
                        <button
                          className="btn-red"
                          onClick={() => deleteUser(user)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h1 className=" mt-3">Users</h1>
          <div className=" text-center">
            <div>
              <input
                onChange={(ev) => {
                  setSearchEmail(ev.target.value);
                }}
                value={searchEmail}
                type="text"
                className=" w-96"
                placeholder="Search user (email)"
              />
              <button onClick={() => fetchUsers()} className="btn-default ml-4">
                Search
              </button>
            </div>
          </div>
          <div>
            <table className="basic mt-4">
              <thead>
                <tr>
                  <td>email</td>
                  <td>name</td>
                  <td>postal code</td>
                  <td>status</td>
                </tr>
              </thead>
              <tbody>
                {!!users.length &&
                  users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.email}</td>
                      <td>{user.name}</td>
                      <td>{user.postalCode || "Undefined"}</td>
                      <td className="text-center">
                        <button
                          className={user.ban ? "btn-green" : "btn-red"}
                          style={{ minWidth: "80px" }}
                          onClick={() => banUser(user)}
                        >
                          {user.ban ? "Unban" : "Ban"}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <Paginate
              page={page}
              setPage={setPage}
              disabledButton={disabledButton}
              setDisabledButton={setDisabledButton}
              params={users}
            />
          </div>
        </div>
      </Layout>
    </>
  );
}

export default withSwal(({ swal }, ref) => <UsersPage swal={swal} />);
