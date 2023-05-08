import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Pagination } from "react-bootstrap";
import { toast } from "react-toastify";
const Log = () => {
  let [maxPage, setMaxPage] = useState(0);
  let re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((([a-zA-Z]+\.)+[a-zA-Z]{2,}))$/;
  let [no, setNo] = useState(0);
  let [updatedData, setUpdatedData] = useState({});
  let [studentsList, setStudentsList] = useState([]);
  let [page, setPage] = useState(1);
  let [search, setsearch] = useState("");
  let [editModel, setEditModel] = useState(false);
  let [remove, setRemove] = useState(false);
  let [limit, setlimit] = useState(5);
  const getData = async () => {
    try {
      const res = await fetch(
        `/Pagination?page=${page}&search=${search}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      console.log(data);
      setMaxPage(Math.ceil(data.count / limit));
      setStudentsList(data.rows);
      console.log(data.rows);
      if (page >= Math.ceil(data.count / limit)) {
        setPage(Math.ceil(data.count / limit));
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    console.log(limit);
    getData();
  }, [page, limit]);

  useEffect(() => {
    const time = setTimeout(() => {
      getData();
    }, 800);
    return () => {clearTimeout(time)};
  }, [search]);

  const Close = () => {
    setEditModel(false);
  };
  const deleteAlert = (key) => {
    setNo(key);
    setRemove(true);
  };
  const Update_data = async () => {
    if (updatedData.FirstName.length === 0) {
      toast("Enter Valid FirstName");
    } else if (updatedData.LastName.length === 0) {
      toast("Enter Valid LastName");
    } else if (updatedData.Address.length === 0) {
      toast("Enter Valid Address");
    } else if (updatedData.Mobile.length !== 10) {
      toast("Check Mobile Number length");
    } else if (updatedData.Email.length === 0) {
      toast("Enter Valid Email");
    } else if (re.test(updatedData.Email) === false) {
      toast("Enter Valid Email");
    } else if (updatedData.Password.length <= 6) {
      toast("Set password greater than 6");
    } else {
      const res = await fetch("/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      toast(data.message);
      getData();
      Close();
    }
  };
  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "Mobile") {
      if (value.length <= 10) {
        setUpdatedData((prevState) => {
          return {
            ...prevState,
            [name]: value,
          };
        });
      }
    } else {
      setUpdatedData((prevState) => {
        return {
          ...prevState,
          [name]: value,
        };
      });
    }
  };
  const delete_row = async () => {
    const res = await fetch(`/DeleteUser?id=${studentsList[no].id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    toast(data.message);
    getData();
    setRemove(false);
  };
  const Edit_row = (key) => {
    setUpdatedData(studentsList[key]);
    setEditModel(true);
    setNo(key);
  };
  const pageNum = () => {
    const rows = [];
    for (let i = 1; i <= Math.ceil(maxPage); i++) {
      rows.push(
        <Button
        key={i}
          variant={i == page ? "primary" : ""}
          onClick={() => {
            setPage(i);
          }}
        >
          {i}
        </Button>
      );
    }
    return rows;
  };
  const searchValue = (e) => {
    let value = e.target.value;
    setPage(1);
    setsearch(value);
  };
  return (
    <div id="data">
      <div id="table">
        <div className="titlebar">
          <h1>Registered Students</h1>
          <input
            type="text"
            className="search"
            placeholder=" Search Student..."
            onChange={searchValue}
          />
        </div>
        {studentsList?.length ? (
          <>
            <table id="students">
              <thead>
                <tr>
                  <th>Firstname</th>
                  <th>LastName</th>
                  <th>Mobile</th>
                  <th>Address</th>
                  <th>Email</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody id="tbody">
                {studentsList
                  ? studentsList.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td>{item.FirstName}</td>
                          <td>{item.LastName}</td>
                          <td>{item.Mobile}</td>
                          <td>{item.Address}</td>
                          <td>{item.Email}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() => {
                                Edit_row(key);
                              }}
                            >
                              Edit
                            </button>
                          </td>
                          <td>
                            <button
                              type="submit"
                              className="btn btn-danger"
                              onClick={() => deleteAlert(key)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            </table>
            <div id="Pagination">
            <div className="custom-select">
              <label>
                Rows per Page
                <select
                value={limit}
                  onChange={(e) => {
                    setlimit(e.target.value);
                  }}
                >
                  <option>3</option>
                  <option>5</option>
                  <option>7</option>
                </select>
              </label>
            </div>
            <div className="pagesContainer">
              <Button
                variant="primary"
                onClick={() => {
                  page > 1
                  ? setPage(page - 1)
                  : toast("No Previous page found");
                }}
              >
                Prev
              </Button>
              {pageNum()}
              <Button
                variant="primary"
                onClick={() => {
                  maxPage > page
                    ? setPage(page + 1)
                    : toast("No Next Page Found");
                }}
              >
                Next
              </Button>
            </div>
            </div>
          </>
        ) : (
          <h1>No User Found</h1>
        )}

        <div
          className="modal show"
          style={{ display: "block", position: "initial" }}
        >
          <Modal
            show={remove}
            onHide={() => {
              setRemove(false);
            }}
          >
            <Modal.Dialog>
              <Modal.Header closeButton>
                <Modal.Title>Status</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <p>Are you sure?</p>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setRemove(false);
                  }}
                >
                  Close
                </Button>
                <Button variant="primary" onClick={delete_row}>
                  Delete
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal>
          <Modal show={editModel} onHide={Close}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Data</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="FirstName"
                    onChange={handleChange}
                    value={updatedData.FirstName}
                    autoFocus
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea2"
                >
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="LastName"
                    onChange={handleChange}
                    value={updatedData.LastName}
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea3"
                >
                  <Form.Label>Mobile Number</Form.Label>
                  <Form.Control
                    type="number"
                    onChange={handleChange}
                    value={updatedData.Mobile}
                    onKeyDown={(evt) =>
                      (evt.key === "e" || evt.key === "+" || evt.key === "-") &&
                      evt.preventDefault()
                    }
                    name="Mobile"
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea4"
                >
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={handleChange}
                    value={updatedData.Address}
                    name="Address"
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput5"
                >
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    onChange={handleChange}
                    value={updatedData.Email}
                    name="Email"
                    placeholder="name@example.com"
                    disabled
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea6"
                >
                  <Form.Label>Change Password</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={handleChange}
                    placeholder="Enter Password if you want to update"
                    // value={updatedData.Password}
                    name="Password"
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={Close}>
                Close
              </Button>
              <Button variant="primary" onClick={Update_data}>
                Edit
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Log;
