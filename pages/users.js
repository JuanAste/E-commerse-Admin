import Layout from "@/components/Layout";
import Paginate from "@/components/Paginate";
import Spinner from "@/components/Spinner";
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
  const [loading, setLoading] = useState(true);
  const [loadingAdmin, setLoadingAdmin] = useState(true);

  useEffect(() => {
    fetchAdmins();
    fetchUsers();
  }, []);

  function fetchUsers() {
    setLoading(true);
    let data = `?page=${page}`;
    if (searchEmail) {
      data += "&&email=" + searchEmail;
    }
    axios
      .get("/api/users" + data)
      .then((res) => {
        setUsers(res.data);
        setDisabledButton(false);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }

  function fetchAdmins() {
    axios
      .get("/api/admins")
      .then((res) => {
        setUsersAdmin(res.data);
        setLoadingAdmin(false);
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
          <div className=" flex justify-center">
            <table className="basic mt-4 max-w-xs md:max-w-lg">
              <thead>
                <tr>
                  <td>Admin email</td>
                  <td></td>
                </tr>
              </thead>
              {!loadingAdmin && (
                <tbody>
                  {!!usersAdmin.length &&
                    usersAdmin.map((user) => (
                      <tr key={user._id}>
                        <td className=" text-xs md:text-base ">{user.email}</td>
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
              )}
            </table>
          </div>
          <div>
            {loadingAdmin ? (
              <div className=" flex justify-center items-center mt-5">
                <Spinner size={60} />
              </div>
            ) : null}
          </div>
        </div>
        <div>
          <h1 className=" mt-3">Users</h1>
          <div className=" text-center">
            <div>
              <input
                onChange={(ev) => {
                  const email = ev.target.value;
                  setSearchEmail(email);
                }}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter") {
                    fetchUsers();
                  }
                }}
                value={searchEmail}
                type="text"
                className=" w-1/2"
                placeholder="Search user (email)"
              />
              <button onClick={() => fetchUsers()} className="btn-default ml-4">
                Search
              </button>
            </div>
          </div>
          <div>
            <table className="basic mt-4 max-w-xs md:max-w-full ">
              <thead>
                <tr>
                  <td>email</td>
                  <td className="hidden md:table-cell ">name</td>
                  <td className="hidden md:table-cell">postal code</td>
                  <td></td>
                </tr>
              </thead>
              {!loading && (
                <tbody>
                  {!!users.length &&
                    users.map((user) => (
                      <tr key={user._id}>
                        <td className=" text-xs md:text-base">{user.email}</td>
                        <td className=" text-xs  md:text-base hidden md:table-cell">
                          {user.name}
                        </td>
                        <td className=" text-xs md:text-base hidden md:table-cell">
                          {user.postalCode || "Undefined"}
                        </td>
                        <td className="text-center text-xs md:text-base ">
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
              )}
            </table>
            <div>
              {loading ? (
                <div className=" flex justify-center items-center mt-5">
                  <Spinner size={60} />
                </div>
              ) : null}
            </div>
            <div>
              {!users?.length && (
                <h1 className=" text-center mt-4">No hay mas usuarios</h1>
              )}
            </div>
            <Paginate
              page={page}
              setPage={setPage}
              disabledButton={disabledButton}
              setDisabledButton={setDisabledButton}
              params={users}
              amount={5}
            />
          </div>
        </div>
      </Layout>
    </>
  );
}

export default withSwal(({ swal }, ref) => <UsersPage swal={swal} />);
