import { useState, useEffect } from "react"
import {
  MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBContainer
  , MDBPagination, MDBPaginationItem, MDBPaginationLink
} from 'mdb-react-ui-kit';
import axios from "axios"

function App() {
  // DATA STATE
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [sortValue, setSortValue] = useState("")
  const [currentPage, setCurrentPage] = useState(0);
  const [pageLimit] = useState(4);

  const sortOptions = ["name", "phone", "email"]
  // ON PAGE RENDER
  const loadUserData = async (start, end, increase) => {
    await axios.get(`http://localhost:5000/users?_start=${start}&_end=${end}`)
      .then((res) => {
        setData(res.data);
        setCurrentPage(currentPage + increase)
      })
      .catch((err) => console.log(err))
  }
  useEffect(() => {
    loadUserData(0, 4, 0);
  }, [])

  console.log("data", data);


  const handleSearch = async (e) => {
    e.preventDefault();
    return await axios.get(`http://localhost:5000/users?q=${search}`)
      .then((res) => {
        setData(res.data);
        setSearch("")
      })
      .catch((err) => console.log(err))
  }
  const handleSort = async (value) => {
    // let value = e.sort.value
    setSortValue(value)
    return await axios.get(`http://localhost:5000/users?_sort=${value}&_order=asc`)
      .then((res) => {
        setData(res.data);
        setSearch("")
      })
      .catch((err) => console.log(err))
  }


  const handleReset = () => {
    loadUserData(0, 4, 0);
  }
  const handleDelete = (id) => {
    const newData = data.filter((item) => item.id != id)
    // console.log(newData)
    setData(newData);
  }

  const renderPagination = () => {
    if (data.length < 4 && currentPage === 0) return null
    if (currentPage == 0) {
      return <MDBPagination className="mb-0">
        <MDBPaginationItem>
          <MDBPaginationLink>1</MDBPaginationLink>
        </MDBPaginationItem>
        <MDBPaginationItem>
          <MDBBtn onClick={() => loadUserData(4, 8, 1)}>Next</MDBBtn>
        </MDBPaginationItem>
      </MDBPagination>
    }
    else if (currentPage < pageLimit - 1 && data.length === pageLimit) {
      return <MDBPagination className="mb-0">
        <MDBPaginationItem>
          <MDBBtn onClick={() => loadUserData((currentPage - 1) * 4, currentPage * 4, -1)}>Prev</MDBBtn>
        </MDBPaginationItem>
        <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
        <MDBPaginationItem>
          <MDBBtn onClick={() => loadUserData((currentPage + 1) * 4, (currentPage + 2) * 4, 1)}>Next</MDBBtn>
        </MDBPaginationItem>
      </MDBPagination>
    }
    else {
      return <MDBPagination className="mb-0">
        <MDBPaginationItem>
          <MDBBtn onClick={() => loadUserData(4, 8, -1)}>Prev</MDBBtn>
        </MDBPaginationItem>
        <MDBPaginationItem>
          <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
        </MDBPaginationItem>
      </MDBPagination>
    }
  }
  // table
  return (
    <div className="App">
      <form style={{
        margin: "auto",
        padding: "15px",
        maxWidth: "400px",
        alignContent: "center"
      }}
        className="d-flex input-group w-auto"
        onSubmit={handleSearch}>
        <input type="text"
          className="form-control"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <MDBBtn type="submit" color="dark">Search</MDBBtn>
        <MDBBtn className="mx-2" color="info" onClick={() => handleReset()}>Reset</MDBBtn>



      </form>
      <MDBContainer style={{ marginTop: "100px" }}>
        <h2 style={{ textAlign: "center" }}>
          Assignment- Search,Pagination,Sort,Delete Action.
        </h2>
        <MDBTable align='middle'>
          {/* head */}
          <MDBTableHead dark>
            <tr>
              <th scope='col'>No.</th>
              <th scope='col'>Name</th>
              <th scope='col'>Email</th>
              <th scope='col'>Phone No.</th>
              <th scope='col'>Address</th>
              <th scope='col'>Action</th>
            </tr>
          </MDBTableHead>
          {/* body */}
          <MDBTableBody>
            {
              data.map((user, index) => {
                return <tr id="user.id">
                  <td>{index + 1}</td>
                  <td>
                    {/* Leanne Graham */}
                    {user.name}
                  </td>
                  <td>
                    <p className='fw-normal mb-1'>
                      {/* Sincere@april.biz */}
                      {user.email}
                    </p>
                  </td>
                  <td>
                    <p className="fw-normal mb-1">
                      {/* 1-770-736-8031 */}
                      {user.phone}
                    </p>
                  </td>
                  <td>
                    {/* Kulas Light, Apt. 556 , Gwenborough */}
                    {user.address.street}
                  </td>
                  <td>
                    <MDBBtn color="danger" onClick={() => handleDelete(user.id)}>
                      Delete
                    </MDBBtn>
                  </td>
                </tr>
              })
            }

          </MDBTableBody>
        </MDBTable>
        <div style={{
          margin: "auto",
          padding: "15px",
          maxWidth: "250px",
          alignContent: "center"
        }}> {renderPagination()}</div>
        <div>
          <h5>Sort By:</h5>
          <select style={{ width: "50%", borderRadius: "2px", height: "35px" }}
            onChange={(e) => handleSort(e.target.value)}
            value={sortValue}>
            {sortOptions.map((item, index) => {
              return <option value={item} id={index}>
                {item}
              </option>
            })}
          </select>
        </div>
      </MDBContainer>
    </div>
  );
}

export default App;
