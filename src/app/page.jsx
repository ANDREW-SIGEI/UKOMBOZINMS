"use client";
import React from "react";
// import { useState } from "react";
import { useState, useEffect } from "react";


function MainComponent() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userStats, setUserStats] = useState({
    totalLoans: 0,
    activeGroups: 0,
    totalMembers: 0,
    upcomingMeetings: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [groupSearchTerm, setGroupSearchTerm] = useState("");
  const [newGroup, setNewGroup] = useState({
    name: "",
    county: "",
    constituency: "",
    location: "",
    village: "",
    status: "active",
    members: 0,
    totalSavings: 0,
  });
  const countyConstituencies = {
    Narok: [
      "Narok North",
      "Narok South",
      "Narok East",
      "Narok West",
      "Kilgoris",
      "Emurua Dikirr",
    ],
    Bomet: ["Bomet Central", "Bomet East", "Chepalungu", "Sotik", "Konoin"],
    Kericho: [
      "Ainamoi",
      "Belgut",
      "Bureti",
      "Kipkelion East",
      "Kipkelion West",
      "Sigowet/Soin",
    ],
    Nakuru: [
      "Naivasha",
      "Gilgil",
      "Nakuru Town West",
      "Nakuru Town East",
      "Kuresoi South",
      "Kuresoi North",
      "Molo",
      "Njoro",
      "Subukia",
      "Rongai",
      "Bahati",
    ],
    Nairobi: [
      "Westlands",
      "Dagoretti North",
      "Dagoretti South",
      "Langata",
      "Kibra",
      "Roysambu",
      "Kasarani",
      "Ruaraka",
      "Embakasi South",
      "Embakasi North",
      "Embakasi Central",
      "Embakasi East",
      "Embakasi West",
      "Makadara",
      "Kamukunji",
      "Starehe",
      "Mathare",
    ],
  };
  const members = [
    {
      id: "M001",
      name: "Jane Doe",
      group: "Imani Group",
      phoneNumber: "+254 712 345 678",
      nationalId: "12345678",
      status: "active",
      loanBalance: 25000,
      joinDate: "2024-01-15",
      nextOfKin: {
        name: "",
        phoneNumber: "",
      },
      registrationFee: 200,
    },
    {
      id: "M002",
      name: "Mary Smith",
      group: "Tumaini Group",
      phoneNumber: "+254 723 456 789",
      nationalId: "23456789",
      status: "inactive",
      loanBalance: 15000,
      joinDate: "2024-02-01",
      nextOfKin: {
        name: "",
        phoneNumber: "",
      },
      registrationFee: 200,
    },
    {
      id: "M003",
      name: "Sarah Johnson",
      group: "Imani Group",
      phoneNumber: "+254 734 567 890",
      nationalId: "34567890",
      status: "active",
      loanBalance: 30000,
      joinDate: "2024-01-20",
      nextOfKin: {
        name: "",
        phoneNumber: "",
      },
      registrationFee: 200,
    },
  ];
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    group: "",
    phoneNumber: "",
    nationalId: "",
    status: "active",
    nextOfKin: {
      name: "",
      phoneNumber: "",
    },
    registrationFee: 200,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/data");
        const data = await response.json();
        setIsAdmin(data.role === "admin");
        setUserStats(data.stats);
      } catch (error) {
        console.error("Failed to fetch user data");
      }
    };
    fetchUserData();
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.nationalId.includes(searchTerm);
    const matchesFilter =
      selectedFilter === "all" || member.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });
  const handleAddMember = () => {
    const newId = `M${(members.length + 1).toString().padStart(3, "0")}`;
    const memberToAdd = {
      ...newMember,
      id: newId,
      joinDate: new Date().toISOString().split("T")[0],
      loanBalance: 0,
    };

    members.push(memberToAdd);
    setShowAddMemberModal(false);
    setNewMember({
      name: "",
      group: "",
      phoneNumber: "",
      nationalId: "",
      email: "",
      status: "active",
    });
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-xl">Loading...</div>
        </div>
      );
    }

    switch (activeTab) {
      case "dashboard":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <i className="fas fa-money-bill text-blue-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-500 text-sm">Total Loans</p>
                    <h3 className="text-xl font-semibold">
                      {userStats.totalLoans}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full">
                    <i className="fas fa-users text-green-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-500 text-sm">Active Groups</p>
                    <h3 className="text-xl font-semibold">
                      {userStats.activeGroups}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <i className="fas fa-user text-purple-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-500 text-sm">Total Members</p>
                    <h3 className="text-xl font-semibold">
                      {userStats.totalMembers}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <i className="fas fa-calendar text-yellow-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-500 text-sm">Upcoming Meetings</p>
                    <h3 className="text-xl font-semibold">
                      {userStats.upcomingMeetings}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold mb-4 md:mb-0">
                  Recent Members
                </h2>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                  <input
                    type="text"
                    placeholder="Search members..."
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] w-full md:w-auto"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <select
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] w-full md:w-auto"
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                  >
                    <option value="all">All Members</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Member ID
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Group
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Loan Balance
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredMembers.slice(0, 5).map((member) => (
                          <tr key={member.id} className="hover:bg-gray-50">
                            <td className="px-3 py-4 whitespace-nowrap text-sm">
                              {member.id}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm">
                              {member.name}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm">
                              {member.group}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  member.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {member.status.charAt(0).toUpperCase() +
                                  member.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm">
                              KES {member.loanBalance.toLocaleString()}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm">
                              <div className="flex space-x-3">
                                <button className="text-[#2563eb] hover:text-[#1d4ed8]">
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button className="text-gray-600 hover:text-gray-900">
                                  <i className="fas fa-edit"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case "members":
        return (
          <>
             <div>
                   <h1>Dashboard</h1>
           </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold mb-4 md:mb-0">
                  Members List
                </h2>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                  <input
                    type="text"
                    placeholder="Search members..."
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <select
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                  >
                    <option value="all">All Members</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <button
                    className="bg-[#2563eb] text-white px-4 py-2 rounded-lg hover:bg-[#1d4ed8]"
                    onClick={() => setShowAddMemberModal(true)}
                  >
                    <i className="fas fa-plus mr-2"></i>Add Member
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Member ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Group
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        National ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Join Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Loan Balance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredMembers.map((member) => (
                      <tr key={member.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {member.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {member.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {member.group}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>{member.phoneNumber}</div>
                          <div className="text-sm text-gray-500">
                            {member.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {member.nationalId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(member.joinDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              member.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {member.status.charAt(0).toUpperCase() +
                              member.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          KES {member.loanBalance.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-3">
                            <button className="text-[#2563eb] hover:text-[#1d4ed8]">
                              <i className="fas fa-eye"></i>
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <i className="fas fa-edit"></i>
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {showAddMemberModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-md w-full">
                  <h2 className="text-2xl font-semibold mb-6">
                    Add New Member
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Full Name (First, Middle, Last)
                      </label>
                      <input
                        type="text"
                        placeholder="Enter three names"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={newMember.name}
                        onChange={(e) =>
                          setNewMember({ ...newMember, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Group
                      </label>
                      <input
                        type="text"
                        list="groups"
                        placeholder="Select a group or enter new group"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={newMember.group}
                        onChange={(e) =>
                          setNewMember({
                            ...newMember,
                            group: e.target.value,
                          })
                        }
                      />
                      <datalist id="groups">
                        <option value="Imani Group" />
                        <option value="Tumaini Group" />
                      </datalist>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+254 7XX XXX XXX"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={newMember.phoneNumber}
                        onChange={(e) =>
                          setNewMember({
                            ...newMember,
                            phoneNumber: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        National ID
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={newMember.nationalId}
                        onChange={(e) =>
                          setNewMember({
                            ...newMember,
                            nationalId: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-700">
                        Next of Kin Details
                      </h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <input
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={newMember.nextOfKin.name}
                          onChange={(e) =>
                            setNewMember({
                              ...newMember,
                              nextOfKin: {
                                ...newMember.nextOfKin,
                                name: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          placeholder="+254 7XX XXX XXX"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={newMember.nextOfKin.phoneNumber}
                          onChange={(e) =>
                            setNewMember({
                              ...newMember,
                              nextOfKin: {
                                ...newMember.nextOfKin,
                                phoneNumber: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Registration Fee
                      </label>
                      <input
                        type="text"
                        disabled
                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                        value="KES 200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={newMember.status}
                        onChange={(e) =>
                          setNewMember({ ...newMember, status: e.target.value })
                        }
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowAddMemberModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-[#2563eb] text-white rounded-md hover:bg-[#1d4ed8]"
                      onClick={handleAddMember}
                    >
                      Add Member
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        );
      case "groups":
        return (
          <>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold mb-4 md:mb-0">
                  Groups List
                </h2>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                  <input
                    type="text"
                    placeholder="Search groups..."
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                    value={groupSearchTerm}
                    onChange={(e) => setGroupSearchTerm(e.target.value)}
                  />
                  <button
                    className="bg-[#2563eb] text-white px-4 py-2 rounded-lg hover:bg-[#1d4ed8]"
                    onClick={() => setShowGroupModal(true)}
                  >
                    <i className="fas fa-plus mr-2"></i>Add Group
                  </button>
                </div>
              </div>
            </div>
            {showGroupModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-md w-full">
                  <h2 className="text-2xl font-semibold mb-6">Add New Group</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Group Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter group name"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={newGroup.name}
                        onChange={(e) =>
                          setNewGroup({ ...newGroup, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        County
                      </label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={newGroup.county}
                        onChange={(e) => {
                          const county = e.target.value;
                          setNewGroup({
                            ...newGroup,
                            county,
                            constituency: "",
                          });
                          setSelectedCounty(county);
                        }}
                      >
                        <option value="">Select a county</option>
                        {Object.keys(countyConstituencies).map((county) => (
                          <option key={county} value={county}>
                            {county}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Constituency
                      </label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={newGroup.constituency}
                        onChange={(e) => {
                          setNewGroup({
                            ...newGroup,
                            constituency: e.target.value,
                          });
                          setSelectedConstituency(e.target.value);
                        }}
                        disabled={!newGroup.county}
                      >
                        <option value="">Select a constituency</option>
                        {newGroup.county &&
                          countyConstituencies[newGroup.county].map(
                            (constituency) => (
                              <option key={constituency} value={constituency}>
                                {constituency}
                              </option>
                            )
                          )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <input
                        type="text"
                        placeholder="Enter location"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={newGroup.location}
                        onChange={(e) =>
                          setNewGroup({ ...newGroup, location: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Village
                      </label>
                      <input
                        type="text"
                        placeholder="Enter village"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={newGroup.village}
                        onChange={(e) =>
                          setNewGroup({ ...newGroup, village: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowGroupModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-[#2563eb] text-white rounded-md hover:bg-[#1d4ed8]"
                      onClick={() => {
                        setShowGroupModal(false);
                      }}
                    >
                      Add Group
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage:
            'url("https://ucarecdn.com/37701913-05a8-40ba-9386-236cf82f42e6/-/format/auto/")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.15,
        }}
      />
      <div className="relative z-10">
        <nav className="bg-white shadow-sm fixed w-full z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden p-2"
                >
                  <i className="fas fa-bars text-xl"></i>
                </button>
                <div className="flex-shrink-0 flex items-center">
                  <span className="text-2xl font-bold text-[#2563eb] font-poppins">
                    UKOMBOZINI
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <button className="p-2 rounded-md text-gray-400 hover:text-gray-500">
                  <i className="fas fa-bell text-xl"></i>
                </button>
                <div className="ml-3 relative">
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700">
                    <img
                      className="h-8 w-8 rounded-full"
                      src="https://ucarecdn.com/cbf234c5-42f6-4e86-8462-841e43f5506c/-/format/auto/"
                      alt="User avatar"
                    />
                    <span className="hidden md:inline">John Doe</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <div className="flex h-screen pt-16">
          <div
            className={`bg-[#1a1a1a] text-white w-64 fixed h-full transition-transform duration-300 ease-in-out ${
              sidebarOpen ? "translate-x-0" : "-translate-x-64"
            } md:translate-x-0 z-20`}
          >
            <div className="p-4 h-full overflow-y-auto">
              <h1 className="text-xl font-crimson-text font-bold mb-8">
                Ukombozini WMS
              </h1>
              <nav className="space-y-1">
                <button
                  onClick={() => {
                    setActiveTab("dashboard");
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left p-3 mb-2 rounded ${
                    activeTab === "dashboard"
                      ? "bg-[#2d2d2d]"
                      : "hover:bg-[#2d2d2d]"
                  }`}
                >
                  <i className="fas fa-chart-line mr-2"></i> Dashboard
                </button>
                <button
                  onClick={() => {
                    setActiveTab("members");
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left p-3 mb-2 rounded ${
                    activeTab === "members"
                      ? "bg-[#2d2d2d]"
                      : "hover:bg-[#2d2d2d]"
                  }`}
                >
                  <i className="fas fa-users mr-2"></i> Members
                </button>
                <button
                  onClick={() => {
                    setActiveTab("groups");
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left p-3 mb-2 rounded ${
                    activeTab === "groups"
                      ? "bg-[#2d2d2d]"
                      : "hover:bg-[#2d2d2d]"
                  }`}
                >
                  <i className="fas fa-layer-group mr-2"></i> Groups
                </button>
                <button
                  onClick={() => {
                    setActiveTab("loans");
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left p-3 mb-2 rounded ${
                    activeTab === "loans"
                      ? "bg-[#2d2d2d]"
                      : "hover:bg-[#2d2d2d]"
                  }`}
                >
                  <i className="fas fa-money-bill-wave mr-2"></i> Loans
                </button>
                <button
                  onClick={() => {
                    setActiveTab("meetings");
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left p-3 mb-2 rounded ${
                    activeTab === "meetings"
                      ? "bg-[#2d2d2d]"
                      : "hover:bg-[#2d2d2d]"
                  }`}
                >
                  <i className="fas fa-calendar mr-2"></i> Meetings
                </button>
                <button
                  onClick={() => {
                    setActiveTab("reports");
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left p-3 mb-2 rounded ${
                    activeTab === "reports"
                      ? "bg-[#2d2d2d]"
                      : "hover:bg-[#2d2d2d]"
                  }`}
                >
                  <i className="fas fa-file-alt mr-2"></i> Reports
                </button>
              </nav>
            </div>
          </div>
          <main className="flex-1 overflow-y-auto md:ml-64">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Dashboard
                  </h1>
                  <div className="flex items-center space-x-4">
                    <button className="bg-[#2563eb] text-white px-4 py-2 rounded-md hover:bg-[#1d4ed8]">
                      <i className="fas fa-plus mr-2"></i>
                      <span className="hidden md:inline">Add New</span>
                    </button>
                  </div>
                </div>
                {renderContent()}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;