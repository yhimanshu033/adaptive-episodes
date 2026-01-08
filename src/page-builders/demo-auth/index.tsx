'use client'

import React, { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useDemoAuthStore } from '@/store/demo-auth-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/aural-ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/aural-ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/aural-ui/form'
import Input from '@/components/aural-ui/input'
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@/components/aural-ui/tabs'
import { Typography } from '@/components/aural-ui/typography'

const HOME_ROUTE = '/' as const

const signInSchema = z.object({
	email: z.string().email('Please enter a valid email'),
	password: z.string().min(1, 'Password is required'),
})

const signUpSchema = z.object({
	fullName: z.string().min(2, 'Full name is required'),
	email: z.string().email('Please enter a valid email'),
	dob: z.string().min(1, 'Date of birth is required'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
})

type SignInValues = z.infer<typeof signInSchema>
type SignUpValues = z.infer<typeof signUpSchema>

export default function DemoAuthPage() {
	const router = useRouter()
	const { isAuthenticated, signIn, signUp } = useDemoAuthStore()

	useEffect(() => {
		// Client-side safety net; middleware should already redirect authed users.
		if (isAuthenticated) {
			router.replace(HOME_ROUTE)
		}
	}, [isAuthenticated, router])

	const signInForm = useForm<SignInValues>({
		resolver: zodResolver(signInSchema),
		defaultValues: { email: '', password: '' },
	})

	const signUpForm = useForm<SignUpValues>({
		resolver: zodResolver(signUpSchema),
		defaultValues: { fullName: '', email: '', dob: '', password: '' },
	})

	const disabledSignIn = useMemo(
		() => signInForm.formState.isSubmitting,
		[signInForm]
	)
	const disabledSignUp = useMemo(
		() => signUpForm.formState.isSubmitting,
		[signUpForm]
	)

	const onSubmitSignIn = (values: SignInValues) => {
		const res = signIn(values)
		if (!res.ok) {
			toast.error(res.error)
			return
		}
		toast.success('Signed in successfully.')
		router.replace(HOME_ROUTE)
	}

	const onSubmitSignUp = (values: SignUpValues) => {
		const res = signUp(values)
		if (!res.ok) {
			toast.error(res.error)
			return
		}
		toast.success('Account created. You are now signed in.')
		router.replace(HOME_ROUTE)
	}

	return (
		<div className="flex min-h-screen w-full items-center justify-center px-6 py-14">
			<Card className="w-[25vw]!">
				<CardHeader className="gap-2">
					<CardTitle>
						<Typography variant="label-large" as="h2">
							Welcome
						</Typography>
					</CardTitle>
					<CardDescription>
						<Typography variant="body-small" color="tertiary">
							Sign in to continue, or create a new account.
						</Typography>
					</CardDescription>
				</CardHeader>

				<CardContent>
					<Tabs size="sm" defaultValue="signin" className="w-full">
						<TabsList className="mb-6">
							<TabsTrigger value="signin">Sign in</TabsTrigger>
							<TabsTrigger value="signup">Sign up</TabsTrigger>
						</TabsList>

						<TabsContent value="signin" className="pt-2">
							<Form {...signInForm}>
								<form
									onSubmit={(e) =>
										void signInForm.handleSubmit(onSubmitSignIn)(e)
									}
									className="flex flex-col gap-5"
								>
									<FormField
										control={signInForm.control}
										name="email"
										render={({ field }) => (
											<FormItem className="space-y-2">
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input.Base
														{...field}
														value={field.value ?? ''}
														type="email"
														placeholder="you@company.com"
														decoration="outline"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={signInForm.control}
										name="password"
										render={({ field }) => (
											<FormItem className="space-y-2">
												<FormLabel>Password</FormLabel>
												<FormControl>
													<Input.Base
														{...field}
														value={field.value ?? ''}
														type="password"
														placeholder="••••••••"
														decoration="outline"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="pt-2">
										<Button
											type="submit"
											className="w-full"
											isDisabled={disabledSignIn}
											disabled={disabledSignIn}
											innerClassName="translate-y-0"
										>
											Sign in
										</Button>
									</div>
								</form>
							</Form>
						</TabsContent>

						<TabsContent value="signup" className="pt-2">
							<Form {...signUpForm}>
								<form
									onSubmit={(e) =>
										void signUpForm.handleSubmit(onSubmitSignUp)(e)
									}
									className="flex flex-col gap-5"
								>
									<FormField
										control={signUpForm.control}
										name="fullName"
										render={({ field }) => (
											<FormItem className="space-y-2">
												<FormLabel>Full name</FormLabel>
												<FormControl>
													<Input.Base
														{...field}
														value={field.value ?? ''}
														placeholder="John Doe"
														decoration="outline"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={signUpForm.control}
										name="email"
										render={({ field }) => (
											<FormItem className="space-y-2">
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input.Base
														{...field}
														value={field.value ?? ''}
														type="email"
														placeholder="you@company.com"
														decoration="outline"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={signUpForm.control}
										name="dob"
										render={({ field }) => (
											<FormItem className="space-y-2">
												<FormLabel>Date of birth</FormLabel>
												<FormControl>
													<Input.Base
														{...field}
														value={field.value ?? ''}
														type="date"
														decoration="outline"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={signUpForm.control}
										name="password"
										render={({ field }) => (
											<FormItem className="space-y-2">
												<FormLabel>Password</FormLabel>
												<FormControl>
													<Input.Base
														{...field}
														value={field.value ?? ''}
														type="password"
														placeholder="Create a password"
														decoration="outline"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="pt-2">
										<Button
											type="submit"
											className="w-full"
											isDisabled={disabledSignUp}
											disabled={disabledSignUp}
											innerClassName="translate-y-0"
										>
											Create account
										</Button>
									</div>
								</form>
							</Form>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	)
}
