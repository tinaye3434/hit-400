<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('members/index', [
            'members' => Member::all(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd($request->all());
        try {
            Member::create([
                'wallet_address' => $request->wallet_address,
                'full_name' => $request->full_name,
                'email' => $request->email,
                'phone' => $request->phone,
                'membership_status' => 'active',
                'joining_date' => $request->joining_date,
                'gender' => $request->gender
            ]);
            return redirect()->route('members.index')->with('success', 'Member created successfully.');
        } catch (\Throwable $th) {
            dd($th);
            return redirect()->route('members.index')->with('error', $th->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Member $member)
    {
        try {
            $member->update($request->all());
            return redirect()->route('members.index')->with('success', 'Member updated successfully.');
        } catch (\Throwable $th) {
            dd($th);
            return redirect()->route('members.index')->with('error', $th->getMessage());
        }
        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function statusChange(Member $member)
    {
        try {
            $member->update(['membership_status' => $member->membership_status == 'active' ? 'inactive' : 'active']);
            return redirect()->route('members.index')->with('success', 'Member status updated successfully.');
        } catch (\Throwable $th) {
            dd($th);
            return redirect()->route('members.index')->with('error', $th->getMessage());
        }
    }
}
