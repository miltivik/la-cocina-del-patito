"use client";

import { SignInForm, SignUpForm } from "@/components/ui/auth-forms";
import { useState } from "react";

export default function LoginPage() {
	const [showSignIn, setShowSignIn] = useState(true);

	return showSignIn ? (
		<SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
	) : (
		<SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
	);
}
