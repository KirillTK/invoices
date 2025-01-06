'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '~/shared/components/button'
import { Card, CardContent } from '~/shared/components/card/card'
import { ChevronRight, DollarSign, PieChart, Users } from 'lucide-react'
import { SignedIn, SignedOut, SignInButton, useAuth, UserButton } from '@clerk/nextjs';
import { Footer } from '~/shared/components/footer';
import Link from 'next/link';

export default function HomePage() {
  const auth = useAuth();
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 500], [0, 50]);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const headerAnimation = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 }
  };

  const loginButtonAnimation = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="container mx-auto px-4 py-8 flex justify-between items-center">
        <motion.h1 
          {...headerAnimation}
          className="text-3xl font-bold text-gray-800"
        >
          {auth?.userId ? <Link href="/invoices" prefetch>InvoiceApp</Link> : 'InvoiceApp'}
        </motion.h1>
        
        <motion.div {...loginButtonAnimation}>
          <SignedOut>
            <SignInButton>
              <Button>
                Login
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </motion.div>
      </header> 

      <main className="container mx-auto px-4 py-12">
        <motion.section 
          className="text-center mb-16"
          {...fadeInUp}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simplify Your Invoicing Process
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create, manage, and track invoices with ease. Our powerful app streamlines your financial workflow.
          </p>
          
          <SignInButton>
            <Button className="text-lg px-8 py-6">
              Get Started <ChevronRight className="ml-2" />
            </Button>
          </SignInButton>
        </motion.section>

        <section className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            { icon: DollarSign, title: "Easy Invoicing", description: "Create professional invoices in minutes" },
            { icon: PieChart, title: "Insightful Analytics", description: "Track your financial performance with detailed reports" },
            { icon: Users, title: "Client Management", description: "Manage your client information all in one place" }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        <section className="relative h-[400px] mb-16 overflow-hidden rounded-lg shadow-xl">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80 flex items-center justify-center"
            style={{ y: parallaxY }}
          >
            <div className="text-white text-center">
              <h3 className="text-3xl font-bold mb-4">Powerful Dashboard</h3>
              <p className="text-xl max-w-md">Get a bird&apos;s-eye view of your business finances</p>
            </div>
          </motion.div>
        </section>

        <motion.section 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to streamline your invoicing?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that trust InvoiceApp for their financial needs.
          </p>

          <SignInButton fallbackRedirectUrl="/invoices">
            <Button className="text-lg px-8 py-6">
              Start Your Free Trial
            </Button>
          </SignInButton>
        </motion.section>
      </main>

      <Footer/>
    </div>
  )
}
