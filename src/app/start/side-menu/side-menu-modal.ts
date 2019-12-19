export const SIDE_MENU_MODEL = [
  {
    Id: 1,
    Name: "Master",
    path: "",
    icon: "fab fa-creative-commons-by"
  },
  {
    Id: 9,
    Name: "Transaction",
    path: "",
    icon: "fas fa-exchange-alt"
  },
  {
    Id: 20,
    Name: "Report",
    path: "",
    icon: "fas fa-file"
  },
  {
    Id: 28,
    Name: "Configuration",
    path: "",
    icon: "fas fa-cog"
  },
  {
    Id: 107,
    Name: "Crm",
    path: "",
    icon: "far fa-handshake"
  },
  {
    Id: 114,
    Name: "Gst-Report",
    path: "",
    icon: "fas fa-file"
  },
  {
    Id: 2,
    ParentId: 1,
    Name: "Category",
    path: "ims/category",
    icon: ""
  },
  {
    Id: 3,
    ParentId: 1,
    Name: "Unit",
    path: "ims/unit",
    icon: ""
  },
  {
    Id: 4,
    ParentId: 1,
    Name: "Composite Unit",
    path: "ims/composite",
    icon: ""
  },
  {
    Id: 5,
    ParentId: 1,
    Name: "TaxSlab",
    path: "ims/tax",
    icon: ""
  },
  {
    Id: 6,
    Name: "TaxProcess",
    path: "ims/taxProcess",
    icon: ""
  },
  {
    Id: 7,
    ParentId: 1,
    Name: "Discount",
    path: "ims/discount-master",
    icon: ""
  },
  {
    Id: 8,
    ParentId: 1,
    Name: "Item-Master",
    path: "ims/item",
    icon: ""
  },
  {
    Id: 10,
    ParentId: 9,
    Name: "Sale-Challan",
    path: "ims/sale-challan/challan",
    icon: ""
  },
  {
    Id: 11,
    Name: "Sale-Travel",
    path: "ims/sale-travel/sale",
    icon: ""
  },
  {
    Id: 12,
    Name: "Sale-Courier",
    path: "ims/sale-courier-parcel/sale",
    icon: ""
  },
  {
    Id: 13,
    ParentId: 9,
    Name: "Sale",
    path: "ims/sale",
    icon: ""
  },
  {
    Id: 14,
    Name: "Purchase-Challan",
    path: "",
    icon: ""
  },
  {
    Id: 15,
    ParentId: 9,
    Name: "Purchase",
    path: "ims/purchase",
    icon: ""
  },
  {
    Id: 18,
    Name: "Item Custome Rate",
    path: "",
    icon: ""
  },
  {
    Id: 21,
    Name: "Item-Stock",
    path: "ims/report/item-stock",
    icon: ""
  },
  {
    Id: 22,
    Name: "Sale Travel Profit",
    path: "ims/profit-report",
    icon: ""
  },
  {
    Id: 23,
    Name: "Item Sale ",
    path: "ims/report/sale-item",
    icon: ""
  },
  {
    Id: 24,
    Name: "Item Purchase",
    path: "ims/report/purchase-item",
    icon: ""
  },
  {
    Id: 25,
    Name: "Item Inventory",
    path: "ims/report/item-inventory",
    icon: ""
  },
  {
    Id: 26,
    Name: "Trial Balance",
    path: "account/trail-balance",
    icon: ""
  },
  {
    Id: 27,
    Name: "Ledger Summary",
    path: "account/ledger-summary",
    icon: ""
  },
  {
    Id: 29,
    Name: "Item Sale Detail",
    path: "",
    icon: ""
  },
  {
    Id: 30,
    Name: "Day Book",
    path: "ims/report/daybook",
    icon: ""
  },
  {
    Id: 31,
    Name: "Cash Book",
    path: "ims/report/cashbook",
    icon: ""
  },
  {
    Id: 32,
    Name: "Balance Sheet",
    path: "account/balance-sheet",
    icon: ""
  },
  {
    Id: 33,
    Name: "Profit and Loss",
    path: "account/Profit-Loss",
    icon: ""
  },
  {
    Id: 34,
    Name: "Voucher Entry",
    path: "ims/voucher-entry",
    icon: ""
  },
  {
    Id: 35,
    Name: "Service",
    path: "ims/service",
    icon: ""
  },
  {
    Id: 36,
    Name: "Service Billing",
    path: "ims/service-billing",
    icon: ""
  },
  {
    Id: 37,
    ParentId: 1,
    Name: "Customer",
    path: "ims/customer",
    icon: ""
  },
  {
    Id: 38,
    ParentId: 1,
    Name: "Vendor",
    path: "ims/vendor",
    icon: ""
  },
  {
    Id: 39,
    Name: "Routing",
    path: "ims/routing",
    icon: ""
  },
  {
    Id: 40,
    ParentId: 1,
    Name: "Attribute",
    path: "ims/attribute",
    icon: ""
  },
  {
    Id: 41,
    Name: "Sale-Return",
    path: "ims/sale-travel/sale-return",
    icon: ""
  },
  {
    Id: 42,
    ParentId: 9,
    Name: "Sale Return",
    path: "ims/sale-return",
    icon: ""
  },
  {
    Id: 43,
    ParentId: 9,
    Name: "Purchase Return",
    path: "ims/purchase-return",
    icon: ""
  },
  {
    Id: 44,
    ParentId: 28,
    Name: "User",
    path: "users",
    icon: ""
  },
  {
    Id: 45,
    ParentId: 28,
    Name: "User Role",
    path: "usertypes",
    icon: ""
  },
  {
    Id: 46,
    ParentId: 28,
    Name: "User Right",
    path: "user-rights",
    icon: ""
  },
  {
    Id: 47,
    Name: "Profile",
    path: "",
    icon: ""
  },
  {
    Id: 48,
    Name: "Organization Profile",
    path: "",
    icon: ""
  },
  {
    Id: 49,
    ParentId: 28,
    Name: "Branches",
    path: "owner/branch",
    icon: ""
  },
  {
    Id: 50,
    ParentId: 28,
    Name: "Offices",
    path: "owner/branch/office",
    icon: ""
  },
  // {
  //   Id: 51,
  //   ParentId: 28,
  //   Name: "Master Setting",
  //   path: "settings/setup",
  //   icon: ""
  // },
  {
    Id: 52,
    Name: "General Ledger",
    path: "account/ledgergroup",
    icon: ""
  },
  {
    Id: 53,
    Name: "Ledger",
    path: "account/ledgercreation",
    icon: ""
  },
  {
    Id: 54,
    ParentId: 1,
    Name: "Bank",
    path: "ims/bank",
    icon: ""
  },
  {
    Id: 55,
    Name: "Item Category Summary",
    path: "ims/report/item-category",
    icon: ""
  },
  {
    Id: 57,
    Name: "Opening Stock",
    path: "opening-stk",
    icon: ""
  },
  {
    Id: 58,
    Name: "Trading",
    path: "account/trading",
    icon: ""
  },
  {
    Id: 60,
    Name: "TransactionNo",
    path: "transaction-number",
    icon: ""
  },
  {
    Id: 61,
    Name: "Sample Approval",
    path: "manufacturing/sample-approval",
    icon: ""
  },
  {
    Id: 62,
    Name: "Style",
    path: "manufacturing/style",
    icon: ""
  },
  {
    Id: 63,
    Name: "Material Requirement",
    path: "manufacturing/material-requirement",
    icon: ""
  },
  {
    Id: 64,
    Name: "Buyer-Order",
    path: "manufacturing/buyer-order",
    icon: ""
  },
  {
    Id: 65,
    Name: "OutStanding Receivable",
    path: "report/outstanding-receiables",
    icon: ""
  },
  {
    Id: 66,
    Name: "OutStanding Payable",
    path: "report/outstanding-payables",
    icon: ""
  },
  {
    Id: 67,
    Name: "Item Group Stock",
    path: "report/item-group-stock",
    icon: ""
  },
  {
    Id: 68,
    Name: "Cash Day Balance",
    path: "ims/report/cashbook-day",
    icon: ""
  },
  {
    Id: 69,
    Name: "Bank Book",
    path: "ims/report/bankbook",
    icon: ""
  },
  {
    Id: 70,
    Name: "Sale Register",
    path: "ims/report/sale-register",
    icon: ""
  },
  {
    Id: 71,
    Name: "Sale Summary",
    path: "ims/report/sale-summary",
    icon: ""
  },
  {
    Id: 72,
    Name: "Purchase Summary",
    path: "ims/report/purchase-summary",
    icon: ""
  },
  {
    Id: 73,
    Name: "Purchase Register",
    path: "ims/report/purchase-register",
    icon: ""
  },
  {
    Id: 74,
    Name: "Journal Register",
    path: "ims/report/journal-register",
    icon: ""
  },
  {
    Id: 75,
    Name: "Gstr Anx-1",
    path: "report/gstr-anx-1-summary",
    icon: ""
  },
  {
    Id: 76,
    Name: "Gstr Anx-2",
    path: "report/gstr-anx-2-summary",
    icon: ""
  },
  {
    Id: 77,
    Name: "Terms & Conditions",
    path: "ims/Terms&Condition",
    icon: ""
  },
  {
    Id: 78,
    Name: "Msmed OutStanding",
    path: "report/msmed-outstanding",
    icon: ""
  },
  {
    Id: 79,
    Name: "Msmed Bills",
    path: "report/msmed-outstanding/details",
    icon: ""
  },
  {
    Id: 80,
    Name: "Dues-Overdues OutStanding",
    path: "report/dues-overdues-outstanding",
    icon: ""
  },
  {
    Id: 83,
    Name: "Super Admin",
    path: "",
    icon: "fas fa-exchange-alt"
  },
  {
    Id: 84,
    Name: "Client",
    path: "super-admin/client",
    icon: "fas fa-exchange-alt"
  },
  {
    Id: 85,
    Name: "Menu",
    path: "super-admin/menu",
    icon: "fas fa-exchange-alt"
  },
  {
    Id: 87,
    Name: "Custom Rate",
    path: "ims/custom-rate",
    icon: "fas fa-exchange-alt"
  },
  {
    Id: 88,
    Name: "User Setup",
    path: "additional/setup",
    icon: "fas fa-exchange-alt"
  },
  {
    Id: 89,
    Name: "Order Packing",
    path: "manufacturing/packaging",
    icon: "fas-fa-exchange-alt"
  },
  {
    Id: 90,
    ParentId: 1,
    Name: "Item ActiveStatus",
    path: "ims/item-active-status",
    icon: "fas-fa-exchange-alt"
  },
  {
    Id: 94,
    Name: "Packed Order",
    path: "report/packed-orders",
    icon: "fas-fa-exchange-alt"
  },
  {
    Id: 95,
    Name: "Packed Packets",
    path: "report/packed-packets",
    icon: "fas-fa-exchange-alt"
  },
  {
    Id: 96,
    Name: "Packed Items",
    path: "report/packed-items",
    icon: "fas-fa-exchange-alt"
  },
  {
    Id: 91,
    ParentId: 1,
    Name: "Item Growth",
    path: "ims/report/active-inventory-item",
    icon: "fas-fa-exchange-alt"
  },
  {
    Id: 99,
    Name: "Admin Master Setting",
    path: "super-admin/master-setting",
    icon: ""
  },
  {
    Id: 102,
    Name: "Purchase Order",
    path: "manufacturing/purchase-order",
    icon: ""
  },
  {
    Id: 101,
    Name: "GSTR",
    path: "report/gstr-summary",
    icon: ""
  },
  {
    Id: 103,
    Name: "Financial-Year",
    path: "finance",
    icon: ""
  },
  {
    Id: 104,
    Name: "Godown/Location",
    path: "godown",
    icon: ""
  },
  {
    Id: 105,
    Name: "Customer Agent",
    path: "customerAgent",
    icon: ""
  },
  {
    Id: 19,
    Name: "Item Vendor Rate",
    path: "reports/vendor-rates",
    icon: ""
  },
  {
    Id: 108,
    ParentId: 107,
    Name: "Lead",
    path: "crm/lead",
    icon: ""
  },
  {
    Id: 109,
    ParentId: 107,
    Name: "Follow-Up",
    path: "crm/follow-up",
    icon: ""
  },
  {
    Id: 112,
    ParentId: 20,
    Name: "GSTR-3B",
    path: "report/gstr-3b",
    icon: ""
  },
  {
    Id: 116,
    Name: "Item Vendor Rate Report",
    path: "report/item-vendor-rates",
    icon: ""
  },
  {
    Id: 115,
    Name: "PurchaseOrder Status Report",
    path: "report/buyer-order-status",
    icon: ""
  },
  {
    Id: 120,
    Name: "Manual Stock",
    path: "manual-stock",
    icon: ""
  },
  {
    Id: 118,
    Name: "Settings",
    path: "",
    icon: "fas fa-cog"
  },
  {
    Id: 16,
    Name: "Emailer Generator",
    path: "email-editor",
    icon: ""
  }
];
