sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/json/JSONModel"
], function (Controller, ODataModel, JSONModel) {
    "use strict";

    return Controller.extend("vendordashboard.controller.VendorPortal", {

        onInit: function () {

            // ✅ NORTHWIND SERVICE
            var oNorthwindModel = new ODataModel(
                "https://services.odata.org/V2/Northwind/Northwind.svc/",
                true
            );
            this.getView().setModel(oNorthwindModel);


            // =========================
            // ✅ PRODUCTS
            // =========================
            var oProductsModel = new JSONModel({ Products: [] });
            this.getView().setModel(oProductsModel, "productsModel");

            oNorthwindModel.read("/Products", {
                success: function (oData) {
                    console.log("Products loaded", oData.results);

                    oProductsModel.setData({
                        Products: oData.results
                    });

                    // 🔥 update tile count
                    var oTileModel = this.getView().getModel("tileModel");
                    oTileModel.setProperty("/productsCount", oData.results.length);
                }.bind(this)
            });


            // =========================
            // ✅ ORDERS
            // =========================
            var oOrdersModel = new JSONModel({ Orders: [] });
            this.getView().setModel(oOrdersModel, "ordersModel");

            oNorthwindModel.read("/Orders", {
                success: function (oData) {
                    console.log("Orders loaded", oData.results);

                    oOrdersModel.setData({
                        Orders: oData.results
                    });

                    // 🔥 update tile count
                    var oTileModel = this.getView().getModel("tileModel");
                    oTileModel.setProperty("/ordersCount", oData.results.length);
                }.bind(this)
            });

            // =========================
            // ✅ PROFILE
            // =========================
            var oProfileModel = new JSONModel({
                VendorID: "V1001",
                Name: "ABC Suppliers Pvt Ltd",
                City: "Mumbai",
                Country: "India",
                GSTIN: "27ABCDE1234F1Z5",
                Email: "contact@abcsuppliers.com",
                Phone: "+91 9876543210",
                Address: "Bandra Kurla Complex, Mumbai",
                VendorType: "Raw Material Supplier",
                Rating: 4.3
            });
            this.getView().setModel(oProfileModel, "oModel");

            // =========================
            // ✅ PAYMENTS
            // =========================
            var oPaymentsModel = new JSONModel({
                Payments: [
                    { InvoiceNo: "INV1001", Date: "2025-01-10", Amount: 12000, Status: "Paid" },
                    { InvoiceNo: "INV1002", Date: "2025-01-15", Amount: 8000, Status: "Pending" },
                    { InvoiceNo: "INV1003", Date: "2025-02-01", Amount: 15000, Status: "Paid" }
                ]
            });
            this.getView().setModel(oPaymentsModel, "paymentsModel");

            // =========================
            // ✅ OVERVIEW
            // =========================
            var oOverviewModel = new JSONModel({
                TotalOrders: 45,
                TotalRevenue: 120000,
                PendingPayments: 2,
                TopProduct: "Chai",
                Ratings: [
                    { Month: "Jan", Rating: 4.1 },
                    { Month: "Feb", Rating: 4.3 },
                    { Month: "Mar", Rating: 4.0 },
                    { Month: "Apr", Rating: 4.5 },
                    { Month: "May", Rating: 4.2 },
                    { Month: "Jun", Rating: 4.6 },
                    { Month: "Jul", Rating: 4.4 },
                    { Month: "Aug", Rating: 4.7 },
                    { Month: "Sep", Rating: 4.5 },
                    { Month: "Oct", Rating: 4.8 },
                    { Month: "Nov", Rating: 4.6 },
                    { Month: "Dec", Rating: 4.9 }
                ]
            });
            this.getView().setModel(oOverviewModel, "overviewModel");

            // =========================
            // ✅ TILE COUNTS (DYNAMIC)
            // =========================
            var oTileModel = new JSONModel({
                profileCount: 1,
                productsCount: 0,
                ordersCount: 0,
                paymentsCount: 3,
                overviewCount: 12
            });
            this.getView().setModel(oTileModel, "tileModel");

            // 🔥 Dynamic counts
            oNorthwindModel.read("/Products/$count", {
                success: function (count) {
                    oTileModel.setProperty("/productsCount", count);
                }
            });

            oNorthwindModel.read("/Orders/$count", {
                success: function (count) {
                    oTileModel.setProperty("/ordersCount", count);
                }
            });
        },

        // ✅ LIST NAVIGATION
        onListItemPress: function (oEvent) {
            var oItem = oEvent.getParameter("listItem");
            var sPage = oItem.getCustomData()[0].getValue();
            this.byId("SplitApp").toDetail(this.createId(sPage));
        },

        // ✅ TILE NAVIGATION
        onTilePress: function (oEvent) {
            var sPage = oEvent.getSource().getCustomData()[0].getValue();
            this.byId("SplitApp").toDetail(this.createId(sPage));
        }

    });
});