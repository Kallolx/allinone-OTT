// Helper to get days left until expiry
function getDaysLeft(dateString: string) {
  if (!dateString) return '';
  const now = new Date();
  const expiry = new Date(dateString);
  const diff = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return 'Expired';
  if (diff === 0) return 'Expires today';
  if (diff === 1) return '1 day left';
  return `${diff} days left`;
}
// Helper to format date as yyyy-mm-dd in UTC
function formatDateUTC(dateString: string) {
  if (!dateString) return '';
  const d = new Date(dateString);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "@/lib/api"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  LogOut,
  UserPlus,
  AlertCircle,
  Check,
  X,
  Copy,
  Pencil,
  Trash2,
  KeyRound,
  Search,
  MessageSquare,
  Star,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"


interface User {
  id: number
  full_name: string
  phone_number: string
  username: string
  is_adult: boolean
  status: "active" | "inactive"
  expires_at?: string
  created_at: string
  duration?: string // Added for duration support in edit modal
}

interface Feedback {
  id: number
  name: string
  email?: string
  message: string
  rating: number
  username?: string
  status?: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [activeTab, setActiveTab] = useState<"users" | "feedbacks" | "adult-settings">("users")
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isChangingAdultPassword, setIsChangingAdultPassword] = useState(false)
  const [currentAdultPassword, setCurrentAdultPassword] = useState("")
  const [newAdultPassword, setNewAdultPassword] = useState("")
  const [showAdultPassword, setShowAdultPassword] = useState(false)
  const [newUser, setNewUser] = useState({
    full_name: "",
    phone_number: "",
    is_adult: false,
    status: "active" as "active" | "inactive",
    duration: "unlimited" as "1_week" | "15_days" | "1_month" | "3_months" | "6_months" | "unlimited"
  })
  const [editUser, setEditUser] = useState({
    id: 0,
    full_name: "",
    phone_number: "",
    is_adult: false,
    status: "active" as "active" | "inactive",
    duration: "unlimited" as "1_week" | "15_days" | "1_month" | "3_months" | "6_months" | "unlimited"
  })
  const [isEditingUser, setIsEditingUser] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { toast } = useToast()
  const editDialogCloseRef = useRef<HTMLButtonElement>(null)

  // Check admin authentication and fetch data
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true"
    const adminData = JSON.parse(localStorage.getItem("admin") || "{}")
    
    if (!isAdmin || !adminData.id) {
      navigate("/admin/login")
      return
    }

    // Fetch users list
    const fetchUsers = async () => {
      try {
        const usersList = await api.getUsers()
        setUsers(usersList)
      } catch (err) {
        console.error('Failed to fetch users:', err)
        toast({
          title: "Error",
          description: "Failed to load users list",
          variant: "destructive"
        })
      }
    }

    // Fetch feedbacks list
    const fetchFeedbacks = async () => {
      try {
        const feedbacksList = await api.getFeedbacks()
        setFeedbacks(feedbacksList)
      } catch (err) {
        console.error('Failed to fetch feedbacks:', err)
        toast({
          title: "Error",
          description: "Failed to load feedbacks list",
          variant: "destructive"
        })
      }
    }

    // Fetch current adult page password
    const fetchAdultPassword = async () => {
      try {
        const passwordData = await api.getAdultPagePassword()
        setCurrentAdultPassword(passwordData.password)
      } catch (err) {
        console.error('Failed to fetch adult password:', err)
      }
    }

    fetchUsers()
    fetchFeedbacks()
    fetchAdultPassword()
  }, [navigate, toast])

  const handleLogout = () => {
    localStorage.removeItem("isAdmin")
    navigate("/admin/login")
  }

  const generateUsername = (fullName: string) => {
    // Generate a username based on full name and random numbers
    const baseName = fullName.toLowerCase().replace(/[^a-z]/g, "")
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    return `${baseName}${randomNum}`
  }

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!editUser.full_name || !editUser.phone_number) {
      setError("Please fill in all required fields")
      return
    }

    try {
      // Update user via API
      const updateData = {
        full_name: editUser.full_name,
        phone_number: editUser.phone_number,
        is_adult: editUser.is_adult,
        status: editUser.status,
        duration: editUser.duration
      };
      
      const updatedUser = await api.updateUser(editUser.id, updateData)
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === editUser.id ? { ...user, ...updatedUser } : user
        )
      )

      // Check if the updated user is the currently logged-in user
      const currentUserData = localStorage.getItem('user')
      if (currentUserData) {
        const currentUser = JSON.parse(currentUserData)
        // Check by username since we don't have user ID in localStorage
        const updatedUserFromState = users.find(user => user.id === editUser.id)
        if (updatedUserFromState && currentUser.username === updatedUserFromState.username) {
          // Update the localStorage user data
          const updatedCurrentUser = {
            ...currentUser,
            full_name: updatedUser.full_name || updateData.full_name,
            phone_number: updatedUser.phone_number || updateData.phone_number,
            is_adult: updatedUser.is_adult !== undefined ? updatedUser.is_adult : updateData.is_adult,
            status: updatedUser.status || updateData.status
          }
          localStorage.setItem('user', JSON.stringify(updatedCurrentUser))
          
          // Dispatch custom event to notify header to refresh
          window.dispatchEvent(new CustomEvent('userDataUpdated'))
        }
      }

      // Close the edit dialog
      setEditUser({
        id: 0,
        full_name: "",
        phone_number: "",
        is_adult: false,
        status: "active",
        duration: "unlimited"
      })

      // Programmatically close the dialog
      if (editDialogCloseRef.current) {
        editDialogCloseRef.current.click();
      }

      toast({
        description: "User information updated successfully!"
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update user information",
        variant: "destructive"
      })
    }
  }

  const openEditDialog = (user: User) => {
    setEditUser({
      id: user.id,
      full_name: user.full_name,
      phone_number: user.phone_number,
      is_adult: user.is_adult,
      status: user.status,
  duration: (user.duration as any) || "unlimited" // Use user's actual duration if available
    })
    setIsEditingUser(true)
    setError("")
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!newUser.full_name || !newUser.phone_number) {
      setError("Please fill in all required fields")
      return
    }

    try {
      const adminData = JSON.parse(localStorage.getItem("admin") || "{}")
      if (!adminData || !adminData.id) {
        localStorage.removeItem("isAdmin")
        localStorage.removeItem("admin")
        navigate("/admin/login")
        return
      }

      // Make API call to create user
      const createdUser = await api.createUser({
        full_name: newUser.full_name,
        phone_number: newUser.phone_number,
        is_adult: newUser.is_adult,
        status: newUser.status,
        admin_id: adminData.id,
        duration: newUser.duration
      })

      // Update local state with the response from server
      setUsers(prevUsers => [...prevUsers, createdUser])
      setIsAddingUser(false)
      setNewUser({
        full_name: "",
        phone_number: "",
        is_adult: false,
        status: "active",
        duration: "unlimited"
      })

      // Find and click the Cancel button to close the dialog
      const form = e.target as HTMLFormElement;
      const cancelButton = form.querySelector('button[type="button"]') as HTMLButtonElement;
      if (cancelButton) {
        cancelButton.click();
      }

      toast({
        title: "Success",
        description: (
          <div className="flex flex-col gap-1">
            <p>New user created successfully!</p>
            <div className="flex items-center gap-2 bg-muted/50 p-1 rounded text-sm">
              <span>Username:</span>
              <code className="font-mono">{createdUser.username}</code>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 ml-auto"
                onClick={() => {
                  navigator.clipboard.writeText(createdUser.username)
                  toast({
                    description: "Username copied to clipboard",
                    duration: 2000
                  })
                }}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )
      })
    } catch (err) {
      setError("Failed to create user")
    }
  }

  const handleDeleteUser = async (userId: number, username: string) => {
    if (!confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      return
    }

    try {
      await api.deleteUser(userId)
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId))
      toast({
        description: `User "${username}" has been deleted successfully.`
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive"
      })
    }
  }

  const handleDeleteFeedback = async (feedbackId: number, name: string) => {
    if (!confirm(`Are you sure you want to delete feedback from "${name}"? This action cannot be undone.`)) {
      return
    }

    try {
      await api.deleteFeedback(feedbackId)
      setFeedbacks(prevFeedbacks => prevFeedbacks.filter(feedback => feedback.id !== feedbackId))
      toast({
        description: `Feedback from "${name}" has been deleted successfully.`
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete feedback",
        variant: "destructive"
      })
    }
  }

  const handleApproveFeedback = async (feedbackId: number, name: string) => {
    try {
      await api.approveFeedback(feedbackId)
      setFeedbacks(prevFeedbacks => 
        prevFeedbacks.map(feedback => 
          feedback.id === feedbackId 
            ? { ...feedback, status: 'approved' }
            : feedback
        )
      )
      toast({
        description: `Feedback from "${name}" has been approved.`
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to approve feedback",
        variant: "destructive"
      })
    }
  }

  const handleRejectFeedback = async (feedbackId: number, name: string) => {
    try {
      await api.rejectFeedback(feedbackId)
      setFeedbacks(prevFeedbacks => 
        prevFeedbacks.map(feedback => 
          feedback.id === feedbackId 
            ? { ...feedback, status: 'rejected' }
            : feedback
        )
      )
      toast({
        description: `Feedback from "${name}" has been rejected.`
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to reject feedback",
        variant: "destructive"
      })
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError("Please fill in all password fields")
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match")
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long")
      return
    }

    try {
      const adminData = JSON.parse(localStorage.getItem("admin") || "{}")
      await api.changeAdminPassword(adminData.id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
      setIsChangingPassword(false)

      toast({
        title: "Success",
        description: "Password changed successfully!"
      })
    } catch (err: any) {
      setError(err.message || "Failed to change password")
    }
  }

  const handleChangeAdultPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!newAdultPassword) {
      setError("Please enter a new password")
      return
    }

    if (newAdultPassword.length < 4) {
      setError("Password must be at least 4 characters long")
      return
    }

    try {
      await api.updateAdultPagePassword(newAdultPassword)
      setCurrentAdultPassword(newAdultPassword)
      setNewAdultPassword("")
      setIsChangingAdultPassword(false)

      toast({
        title: "Success",
        description: "Adult page password updated successfully!"
      })
    } catch (err: any) {
      setError(err.message || "Failed to update adult page password")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Change Password Button */}
            <Dialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <KeyRound className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Admin Password</DialogTitle>
                  <DialogDescription>
                    Update your admin password. Make sure to use a strong password.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current_password">Current Password</Label>
                    <Input
                      id="current_password"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      placeholder="Enter current password"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new_password">New Password</Label>
                    <Input
                      id="new_password"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      placeholder="Enter new password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">Confirm New Password</Label>
                    <Input
                      id="confirm_password"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      placeholder="Confirm new password"
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsChangingPassword(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Change Password</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Responsive Tab Navigation */}
        <nav
          className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6 border-b border-border overflow-x-auto scrollbar-thin scrollbar-thumb-muted-foreground/30"
          aria-label="Admin dashboard tabs"
        >
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center justify-center px-4 py-2 font-medium border-b-2 transition-colors rounded-t sm:rounded-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:z-10 whitespace-nowrap ${
              activeTab === "users"
                ? "border-primary text-primary bg-background"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
            }`}
            aria-current={activeTab === "users" ? "page" : undefined}
            tabIndex={0}
          >
            <Users className="h-4 w-4 inline mr-2" />
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab("feedbacks")}
            className={`flex items-center justify-center px-4 py-2 font-medium border-b-2 transition-colors rounded-t sm:rounded-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:z-10 whitespace-nowrap ${
              activeTab === "feedbacks"
                ? "border-primary text-primary bg-background"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
            }`}
            aria-current={activeTab === "feedbacks" ? "page" : undefined}
            tabIndex={0}
          >
            <MessageSquare className="h-4 w-4 inline mr-2" />
            Feedbacks ({feedbacks.length})
          </button>
          <button
            onClick={() => setActiveTab("adult-settings")}
            className={`flex items-center justify-center px-4 py-2 font-medium border-b-2 transition-colors rounded-t sm:rounded-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:z-10 whitespace-nowrap ${
              activeTab === "adult-settings"
                ? "border-primary text-primary bg-background"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
            }`}
            aria-current={activeTab === "adult-settings" ? "page" : undefined}
            tabIndex={0}
          >
            <Lock className="h-4 w-4 inline mr-2" />
            Adult Settings
          </button>
        </nav>

        {activeTab === "users" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Users List</h2>
          <Dialog open={isAddingUser} onOpenChange={(open) => {
            setIsAddingUser(open);
            if (!open) {
              setNewUser({ full_name: "", phone_number: "", is_adult: false, status: "active", duration: "unlimited" });
              setError("");
            }
          }}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add New User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Fill in the user details. A username will be generated automatically.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddUser} className="space-y-4">
                {/* Auto-generated Username Field */}
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input
                    readOnly
                    value={newUser.full_name ? generateUsername(newUser.full_name) : ''}
                    className="bg-muted/50 border-muted-foreground/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={newUser.full_name}
                    onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                    placeholder="Enter user's full name"
                    className="border-muted-foreground/20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    value={newUser.phone_number}
                    onChange={(e) => setNewUser({...newUser, phone_number: e.target.value})}
                    placeholder="Enter phone number"
                    className="border-muted-foreground/20"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Age Restriction</Label>
                    <div className="flex items-center space-x-2 px-2 h-10 border rounded-md border-muted-foreground/20">
                      <Switch
                        checked={newUser.is_adult}
                        onCheckedChange={(checked) => setNewUser({...newUser, is_adult: checked})}
                      />
                      <Label>18+ Access</Label>
                    </div>
                    
                  </div>

                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={newUser.status}
                      onValueChange={(value: "active" | "inactive") => 
                        setNewUser({...newUser, status: value})
                      }
                    >
                      <SelectTrigger className="border-muted-foreground/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Account Duration</Label>
                    <Select
                      value={newUser.duration}
                      onValueChange={(value: "1_week" | "15_days" | "1_month" | "3_months" | "6_months" | "unlimited") => 
                        setNewUser({...newUser, duration: value})
                      }
                    >
                      <SelectTrigger className="border-muted-foreground/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1_week">1 Week</SelectItem>
                        <SelectItem value="15_days">15 Days</SelectItem>
                        <SelectItem value="1_month">1 Month</SelectItem>
                        <SelectItem value="3_months">3 Months</SelectItem>
                        <SelectItem value="6_months">6 Months</SelectItem>
                        <SelectItem value="unlimited">Unlimited</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddingUser(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create User</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative max-w-sm bg-white/5 hover:bg-white/10 rounded-lg ring-1 ring-white/20 shadow-lg transition-all duration-200">
            <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
            <Input
              placeholder="Search by name, username, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-transparent border-0 ring-0 focus-visible:ring-2 focus-visible:ring-primary text-white placeholder:text-white/60 rounded-lg"
            />
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="hidden md:table-header-group">
              <TableRow>
                <TableHead className="w-[60px]">#</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead className="hidden lg:table-cell">Phone</TableHead>
                <TableHead className="hidden lg:table-cell">18+</TableHead>
                <TableHead className="hidden lg:table-cell">Status</TableHead>
                <TableHead className="hidden lg:table-cell">Created At</TableHead>
                <TableHead>Expires At</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(() => {
                // Filter users based on search query
                const filteredUsers = users.filter(user =>
                  user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  user.phone_number.includes(searchQuery)
                )

                if (filteredUsers.length === 0) {
                  return (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground">
                        {searchQuery ? `No users found matching "${searchQuery}"` : "No users found. Add your first user."}
                      </TableCell>
                    </TableRow>
                  )
                }

                return filteredUsers.map((user, index) => (
                  <TableRow 
                    key={user.id} 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium text-muted-foreground w-[60px]">#{index + 1}</TableCell>
                    <TableCell className="font-medium hidden md:table-cell">{user.username}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div>{user.full_name}</div>
                        <div className="text-sm text-muted-foreground md:hidden">{user.phone_number}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{user.phone_number}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {user.is_adult ? 
                        <Check className="h-4 w-4 text-green-500" /> : 
                        <X className="h-4 w-4 text-red-500" />
                      }
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {user.expires_at ? (
                        <div className={`text-md font-pixel  ${
                          new Date(user.expires_at) < new Date() 
                            ? 'text-red-600 font-semibold' 
                            : new Date(user.expires_at) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                            ? 'text-yellow-600 font-semibold'
                            : 'text-green-600'
                        }`}>
                          {getDaysLeft(user.expires_at)}
                        </div>
                      ) : (
                        <span className="text-md font-pixel text-gray-500">Unlimited</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => openEditDialog(user)}>
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Edit User</DialogTitle>
                              <DialogDescription>
                                Update user details and settings.
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleEditUser} className="space-y-4">
                              {/* Username Field with Copy Button */}
                              <div className="space-y-2">
                                <Label>Username</Label>
                                <div className="flex items-center gap-2">
                                  <Input
                                    readOnly
                                    value={users.find(u => u.id === editUser.id)?.username || ''}
                                    className="bg-muted/50 border-muted-foreground/20"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="shrink-0"
                                    onClick={() => {
                                      const username = users.find(u => u.id === editUser.id)?.username || '';
                                      navigator.clipboard.writeText(username);
                                      toast({
                                        description: "Username copied to clipboard",
                                        duration: 2000
                                      });
                                    }}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="edit_full_name">Full Name</Label>
                                <Input
                                  id="edit_full_name"
                                  value={editUser.full_name}
                                  onChange={(e) => setEditUser({...editUser, full_name: e.target.value})}
                                  placeholder="Enter user's full name"
                                  className="border-muted-foreground/20"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="edit_phone_number">Phone Number</Label>
                                <Input
                                  id="edit_phone_number"
                                  value={editUser.phone_number}
                                  onChange={(e) => setEditUser({...editUser, phone_number: e.target.value})}
                                  placeholder="Enter phone number"
                                  className="border-muted-foreground/20"
                                />
                              </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                              <div className="space-y-2">
                                <Label>Age Restriction</Label>
                                <div className="flex items-center space-x-2 h-10 border rounded-md border-muted-foreground/20">
                                  <Switch
                                    checked={editUser.is_adult}
                                    onCheckedChange={(checked) => setEditUser({...editUser, is_adult: checked})}
                                  />
                                  <Label>18+ Access</Label>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label>Status</Label>
                                <Select
                                  value={editUser.status}
                                  onValueChange={(value: "active" | "inactive") => 
                                    setEditUser({...editUser, status: value})
                                  }
                                >
                                  <SelectTrigger className="border-muted-foreground/20">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label>Update Duration</Label>
                                <Select
                                  value={editUser.duration}
                                  onValueChange={(value: "1_week" | "15_days" | "1_month" | "3_months" | "6_months" | "unlimited") => 
                                    setEditUser({...editUser, duration: value})
                                  }
                                >
                                  <SelectTrigger className="border-muted-foreground/20">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1_week">1 Week</SelectItem>
                                    <SelectItem value="15_days">15 Days</SelectItem>
                                    <SelectItem value="1_month">1 Month</SelectItem>
                                    <SelectItem value="3_months">3 Months</SelectItem>
                                    <SelectItem value="6_months">6 Months</SelectItem>
                                    <SelectItem value="unlimited">Unlimited</SelectItem>
                                  </SelectContent>
                                </Select>
                                {users.find(u => u.id === editUser.id)?.expires_at && (
                                  <div className="text-xs text-muted-foreground">
                                    Current Expiry: {formatDateUTC(users.find(u => u.id === editUser.id)?.expires_at || '')}
                                  </div>
                                )}
                              </div>
                            </div>

                            {error && (
                              <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                              </Alert>
                            )}

                            <div className="flex justify-end gap-2">
                              <DialogClose ref={editDialogCloseRef} asChild>
                                <Button 
                                  type="button" 
                                  variant="outline"
                                >
                                  Cancel
                                </Button>
                              </DialogClose>
                              <Button type="submit">Update User</Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteUser(user.id, user.username)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                    </TableCell>
                  </TableRow>
                ))
              })()}
            </TableBody>
          </Table>
        </div>
        </>
        )}

        {activeTab === "feedbacks" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">User Feedbacks</h2>
            </div>

            {/* Search Bar for Feedbacks */}
            <div className="mb-4">
              <div className="relative max-w-sm bg-white/5 hover:bg-white/10 rounded-lg ring-1 ring-white/20 shadow-lg transition-all duration-200">
                <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                <Input
                  placeholder="Search feedbacks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 bg-transparent border-0 ring-0 focus-visible:ring-2 focus-visible:ring-primary text-white placeholder:text-white/60 rounded-lg"
                />
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="hidden md:table-header-group">
                  <TableRow>
                    <TableHead className="w-[60px]">#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden lg:table-cell">Email</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead className="hidden lg:table-cell">Rating</TableHead>
                    <TableHead className="hidden lg:table-cell">Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Username</TableHead>
                    <TableHead className="hidden lg:table-cell">Date</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(() => {
                    // Filter feedbacks based on search query
                    const filteredFeedbacks = feedbacks.filter(feedback =>
                      feedback.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (feedback.email && feedback.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                      feedback.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (feedback.username && feedback.username.toLowerCase().includes(searchQuery.toLowerCase()))
                    )

                    if (filteredFeedbacks.length === 0) {
                      return (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-muted-foreground">
                            {searchQuery ? `No feedbacks found matching "${searchQuery}"` : "No feedbacks found yet."}
                          </TableCell>
                        </TableRow>
                      )
                    }

                    return filteredFeedbacks.map((feedback, index) => (
                      <TableRow 
                        key={feedback.id} 
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <TableCell className="font-medium text-muted-foreground w-[60px]">#{index + 1}</TableCell>
                        <TableCell className="font-medium">{feedback.name}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {feedback.email || 'Not provided'}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate" title={feedback.message}>
                            {feedback.message}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < feedback.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="ml-1 text-sm text-muted-foreground">
                              {feedback.rating}/5
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            feedback.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                            feedback.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          }`}>
                            {feedback.status || 'pending'}
                          </span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {feedback.username || 'Guest'}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {new Date(feedback.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {feedback.status !== 'approved' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleApproveFeedback(feedback.id, feedback.name)}
                                className="text-green-500 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                                title="Approve"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            {feedback.status !== 'rejected' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleRejectFeedback(feedback.id, feedback.name)}
                                className="text-orange-500 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                                title="Reject"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteFeedback(feedback.id, feedback.name)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  })()}
                </TableBody>
              </Table>
            </div>
          </>
        )}

        {activeTab === "adult-settings" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Adult Page Settings</h2>
            </div>

            <div className="max-w-md space-y-6">
              {/* Current Password Display */}
              <div className="border rounded-lg p-6 bg-muted/20">
                <h3 className="text-base font-medium mb-4 flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Current Adult Page Password
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  <Input
                    type={showAdultPassword ? "text" : "password"}
                    value={currentAdultPassword}
                    readOnly
                    className="bg-muted/50 border-muted-foreground/20"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => setShowAdultPassword((v) => !v)}
                    aria-label={showAdultPassword ? "Hide password" : "Show password"}
                  >
                    {showAdultPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(currentAdultPassword)
                      toast({
                        description: "Password copied to clipboard",
                        duration: 2000
                      })
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  This password is required to access the adult platforms page.
                </p>
              </div>

              {/* Change Password Section */}
              <div className="border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-medium">Update Password</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsChangingAdultPassword(true)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Change
                  </Button>
                </div>

                {isChangingAdultPassword && (
                  <form onSubmit={handleChangeAdultPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new_adult_password">New Password</Label>
                      <Input
                        id="new_adult_password"
                        type="text"
                        value={newAdultPassword}
                        onChange={(e) => setNewAdultPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="border-muted-foreground/20"
                      />
                      <p className="text-xs text-muted-foreground">
                        Minimum 4 characters required
                      </p>
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="flex gap-2">
                      <Button type="submit" size="sm">
                        Update Password
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setIsChangingAdultPassword(false)
                          setNewAdultPassword("")
                          setError("")
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
