import React from 'react'

const Step1 = ({formdata,onFormDataChange}) => {
    return (
        <>
            <h1 className="text-2xl font-medium mb-8 text-foreground-black">Create your account</h1>
            <div className="space-y-6 flex-grow">
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                    <input
                        type="text"
                        id="fullName"
                        name='name'
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your full name"
                        value={formdata.name}
                        onChange={onFormDataChange}
                    />

                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        id="password"
                        name='password'
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter at least 8 characters"
                        value={formdata.password}
                        onChange={onFormDataChange}
                    />

                </div>
                <div>
                    <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">Account name</label>
                    <input
                        type="text"
                        id="accountName"
                        name='account_name'
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="For example, company's or department's name"
                        value={formdata.account_name}
                        onChange={onFormDataChange}
                    />

                </div>
            </div>
        </>
    )
}

export default Step1