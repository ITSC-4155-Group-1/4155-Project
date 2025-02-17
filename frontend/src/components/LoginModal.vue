<script setup>
</script>

<template>
    <main class="d-flex flex-column min-vh-100">
        <div class="popup">
            <div class="close-btn">&times;</div>
            <div class="form">
                <h2>Login</h2>
                <div class="form-element">
                    <label for="email">Email</label>
                    <input type="text" id="email" placeholder="Enter email">
                </div>
                <div class="form-element">
                    <label for="password">Password</label>
                    <input type="password" id="password" placeholder="Password">
                </div>
                <button>Login</button>
            </div>
            <div class="labelled-separator">
				<span>or</span>
			</div>
            <div class="external-login">
                <form action="" method="post">
                    <input type="submit" class="btn btn-google btn-center" value="Continue with Google">
                </form>
            </div>
        </div>
    </main>
</template>

<style scoped>
* {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    body {
        background-color: linear-gradient(to right, #F0F0F0);
        font-family: 'Courier New', Courier, monospace;
        height: 100vh;
    }
    .popup {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 380px;
        padding: 20px 30px;
        background: #F0F0F0;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.15);
        border-radius: 10px;
        z-index: 1;
    }
    .popup .close-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 15px;
        height: 15px;
        background: #f0f0f0;
        color: black;
        text-align: center;
        line-height: 15px;
        border-radius: 15px;
        cursor: pointer;
    }
    .popup .form h2 {
        text-align: center;
        color: black;
        margin-bottom: 20px;
        font-size: 25px;
    }
    .popup .form .form-element {
        margin: 10px 0;
    }
    .popup .form .form-element label {
        font-size: 14px;
        color: black;
    }
    .popup .form .form-element input {
        margin-top: 5px;
        display: block;
        width: 100%;
        padding: 5px;
        outline: none;
        border: 1px solid black;
        border-radius: 5px;
    }
    .popup .form button {
        width: 100%;
        height: 35px;
        border: none;
        font-size: 16px;
        background: #FFC107;
        color: #F0F0F0;
        border-radius: 10px;
        cursor: pointer;
        margin-top: 10px;
    }
    .labelled-separator {
        display: flex;
        align-items: center;
        text-align: center;
        font-size: 14px;
        color: #666;
        margin: 15px 0;
    }
    .labelled-separator::before,
    .labelled-separator::after {
        content: "";
        flex: 1;
        border-bottom: 1px solid #ccc;
        margin: 0 10px;
    }
    .external-login {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .popup .external-login {
        background-color: #fff;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .3), 0 0 2px rgba(0, 0, 0, .05);
        color: #000;
        font-size: 14px;
        border: none;
        height: 36px;
        border-radius: 5px;
    }
    .popup .external-login .btn-google {
        background-image: url(/google.png);
        background-size: 30px 30px;
        background-repeat: no-repeat;
        background-position: 10px 50%;
        padding: 0 20px 0 40px;
        width: 100%;
        height: 100%;
        display: flex;
    }
</style>