<?php
session_start(); // Démarrage des sessions

// Chemin vers la base de données JSON
$database = 'users.json';

// Charger les données actuelles
$users = file_exists($database) ? json_decode(file_get_contents($database), true) : [];

// Gestion de l'inscription
if (isset($_POST['register'])) {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    foreach ($users as $user) {
        if ($user['username'] === $username || $user['email'] === $email) {
            die('Utilisateur ou email déjà existant !');
        }
    }

    $users[] = [
        'username' => $username,
        'email' => $email,
        'password' => $password,
    ];
    file_put_contents($database, json_encode($users));

    echo "Inscription réussie ! Vous pouvez vous connecter.";
    header("Location: login.html");
    exit();
}

// Gestion de la connexion
if (isset($_POST['login'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];

    foreach ($users as $user) {
        if ($user['username'] === $username && password_verify($password, $user['password'])) {
            // Stocker les informations utilisateur dans une session
            $_SESSION['username'] = $username;
            $_SESSION['logged_in'] = true;

            echo "Connexion réussie !";
            header("Location: index.html");
            exit();
        }
    }

    echo "Nom d'utilisateur ou mot de passe incorrect.";
    exit();
}

// Déconnexion
if (isset($_GET['logout'])) {
    session_destroy();
    header("Location: login.html");
    exit();
}
if (isset($_POST['reset_password'])) {
    $email = $_POST['email'];

    // Vérifie si l'email existe
    foreach ($users as &$user) {
        if ($user['email'] === $email) {
            // Génère un nouveau mot de passe temporaire
            $temp_password = substr(md5(uniqid()), 0, 8);
            $user['password'] = password_hash($temp_password, PASSWORD_DEFAULT);

            // Met à jour la base de données
            file_put_contents($database, json_encode($users));

            // Affiche le mot de passe temporaire (ou envoie-le par email si possible)
            echo "Votre nouveau mot de passe temporaire est : $temp_password";
            exit();
        }
    }

    echo "Email non trouvé.";
    exit();
}
?>
