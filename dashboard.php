<?php
session_start();
if (!isset($_SESSION['admin'])) {
    header("Location: superAdminLogin.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Admin Dashboard</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>
        body {
            background: #f8f9fa;
        }

        .navbar {
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .nav-link {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .dashboard-content {
            padding: 20px;
        }
    </style>
</head>

<body>
    <nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top">
        <div class="container-fluid">
            <a class="navbar-brand fw-bold" href="#">Admin Dashboard</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link" href="employeeCreation.html"><i class="fa-solid fa-user-tie"></i> Employee</a></li>
                    <li class="nav-item"><a class="nav-link" href="groupCreation.html"><i class="fa-solid fa-users"></i> Groups</a></li>
                    <li class="nav-item"><a class="nav-link" href="memberCreation.html"><i class="fa-solid fa-user-tie"></i> Member</a></li>
                    <li class="nav-item"><a class="nav-link text-danger" href="#" id="logoutBtn"><i class="fa-solid fa-right-from-bracket"></i> Logout</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="dashboard-content">
        <h2>Welcome, <?php echo $_SESSION['admin']; ?> 👋</h2>
        <p>Select a group to view its members:</p>

        <div class="table-responsive">
            <table class="table table-bordered table-striped align-middle" id="groupsTable">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Group Number</th>
                        <th>Leader</th>
                        <th>Location</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="groupsContainer"></tbody>
            </table>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="membersModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Group Members</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <table class="table table-bordered" id="membersTable">
                        <thead class="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                   <th>Leader</th>
                                <th>Amount Paid</th>
                                <th>Date</th>
                             
                            </tr>
                        </thead>
                        <tbody id="membersContainer"></tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>


    <script src="js/logout.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/dashboard.js"></script>
</body>

</html>