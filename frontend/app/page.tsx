"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useUser, SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { getAPIURL } from "@/hooks/api-url";
import Link from "next/link";
import { Sidebar } from "@/components/layout/main/dashboard/sidebar";
import { Header } from "@/components/layout/main/dashboard/header";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { Spinner } from "@/components/layout/animation/Spinner";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

export type Product = {
  id: string;
  platform: string;
  price: number;
  productName: string;
};

type Err = {
  response: {
    data: {
      error: string;
    };
  };
};

export default function Home() {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [count, setCount] = useState(0);
  const { toast } = useToast();
  const { isSignedIn, user } = useUser();
  const [formValue, setFormValue] = useState({
    url: "",
    platform: "",
    isPending: false,
  });
  const [data, setData] = useState<Product[]>([]);

  const fetchProducts = async () => {
    if (!isSignedIn) return;

    const url = getAPIURL();
    axios
      .get(`${url}/api/products`, {
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_API_KEY,
          userid: user.id,
        },
      })
      .then(async (res) => {
        setData(res.data);
      })
      .catch(async (err) => {
        console.error(err.response);
      });
  };

  const columns: ColumnDef<Product>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: "id",
      header: " ",
      cell: ({ row }) => <></>,
      enableHiding: true,
      enableColumnFilter: false,
      enableSorting: false,
    },
    {
      accessorKey: "url",
      header: " ",
      cell: ({ row }) => <></>,
      enableHiding: true,
      enableColumnFilter: false,
      enableSorting: false,
    },
    {
      accessorKey: "platform",
      header: "platform",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("platform")}</div>
      ),
    },
    {
      accessorKey: "productName",
      header: "product name",
      cell: ({ row }) => {
        const name: string = row.getValue("productName");
        const split = name.substring(0, 80) + "...";
        const product_url: string = row.getValue("url");

        return (
          <div title={name}>
            <Link href={product_url} target="_blank" className="capitalize">
              {" "}
              {split}
            </Link>
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: () => <div className="text-right">price</div>,
      cell: ({ row }) => {
        const pricing: string = row.getValue("price");

        // Format the pricing as a dollar pricing
        // const formatted = new Intl.NumberFormat("en-US", {
        //   style: "currency",
        //   currency: "USD",
        // }).format(pricing);

        return <div className="text-right font-medium">{pricing}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const DeleteProduct = async () => {
          const id = row.getValue("id");
          const url = getAPIURL();
          axios
            .delete(`${url}/api/products/${id}`, {
              headers: {
                "Content-Type": "application/json",
                apikey: process.env.NEXT_PUBLIC_API_KEY,
              },
            })
            .then((res) => {
              toast({
                description: res.data.data,
              });
              fetchProducts();
            })
            .catch((err) => {
              console.error(err.response);
              toast({
                variant: "destructive",
                description: err.response.data.error,
              });
            });
        };

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-zinc-950 border border-zinc-700/50"
            >
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuSeparator className="w-auto h-[0.01rem] bg-neutral-700" />
              <DropdownMenuItem
                className="bg-transparent cursor-pointer focus:bg-red-600 focus:text-red-200 text-red-300"
                onClick={DeleteProduct}
              >
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  useEffect(() => {
    setCount((prev) => prev + 1);

    count === 1 && fetchProducts();

    return () => {
      setCount(0);
    };
  }, [count, isSignedIn, user?.id]);

  const uploadData = async () => {
    if (!isSignedIn) return;
    setFormValue((prev) => ({ ...prev, isPending: true }));

    const url = getAPIURL();
    axios
      .post(
        `${url}/api/upload`,
        {
          url: formValue.url,
          platform: formValue.platform,
        },
        {
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_API_KEY,
            userid: user.id,
          },
        }
      )
      .then(async (res) => {
        toast({
          description: res.data.data,
        });
        fetchProducts();
        setFormValue((prev) => ({
          ...prev,
          isPending: false,
          url: "",
          platform: "",
        }));
      })

      .catch(async (err: Err) => {
        console.error(err.response);
        setFormValue((prev) => ({ ...prev, isPending: false }));
        toast({
          variant: "destructive",
          description: err.response.data.error,
        });
      });
  };

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  return (
    <>
      <SignedIn>
        <main className="w-full h-screen">
          <Sidebar
            isSignedIn={isSignedIn}
            imageUrl={user?.imageUrl}
            fullName={user?.fullName}
          />
          <Header
            isSignedIn={isSignedIn}
            imageUrl={user?.imageUrl}
            fullName={user?.fullName}
          />
          <div id="page" className="w-full h-screen">
            <section className="flex flex-col gap-4 w-full md:p-10 lg:p-10 p-2 md:px-32 lg:px-32 md:mt-0 lg:mt-0 mt-28">
              <div id="top" className="flex flex-wrap justify-between">
                <hgroup>
                  <h1 className="text-2xl font-medium">Wishes</h1>
                </hgroup>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="x bg-indigo-600 hover:bg-indigo-700 rounded flex gap-2">
                      <Plus /> New wish
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-zinc-950 border border-zinc-700">
                    <DialogHeader>
                      <DialogTitle>Place a wish</DialogTitle>
                    </DialogHeader>
                    {/* add separator */}
                    <Separator className="my-1 bg-zinc-500" />
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-4">
                        <Label htmlFor="name" className="">
                          Product URL
                        </Label>
                        <Input
                          id="name"
                          autoComplete="off"
                          type="url"
                          placeholder="https://e-commerce.com/product/123456"
                          className="col-span-3 placeholder:text-gray-400"
                          disabled={formValue.isPending}
                          onChange={(e) =>
                            setFormValue({ ...formValue, url: e.target.value })
                          }
                          value={formValue.url}
                        />
                      </div>
                      <div className="flex flex-col gap-4">
                        <Label htmlFor="username" className="">
                          Platform
                        </Label>
                        <Select
                          defaultValue={formValue.platform}
                          disabled={formValue.isPending}
                          onValueChange={(value) =>
                            setFormValue({ ...formValue, platform: value })
                          }
                        >
                          <SelectTrigger className="w-full text-gray-400">
                            <SelectValue placeholder="Select a platform" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Platforms</SelectLabel>
                              <SelectItem value="amazon">Amazon</SelectItem>
                              <SelectItem value="ebay">Ebay</SelectItem>
                              <SelectItem value="jumia">Jumia</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        className="bg-indigo-700 hover:bg-indigo-600 flex items-center gap-2"
                        onClick={uploadData}
                        disabled={formValue.isPending}
                      >
                        {formValue.isPending ? (
                          <>
                            <Spinner /> <span>Please wait</span>
                          </>
                        ) : (
                          "Upload data"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div id="middle">
                <hgroup>
                  <h2 className="text-xl font-medium">Wish table</h2>
                </hgroup>
                <div id="list">
                  <div className="w-full">
                    <div className="flex flex-wrap md:gap-0 lg:gap-0 gap-4 items-center py-4">
                      <Input
                        placeholder="Filter by product name..."
                        value={
                          (table
                            .getColumn("productName")
                            ?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                          table
                            .getColumn("productName")
                            ?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm border border-zinc-700"
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="ml-auto border border-zinc-700 hover:bg-zinc-600/20"
                          >
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-zinc-950 border border-zinc-700/50"
                        >
                          {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                              return (
                                <DropdownMenuCheckboxItem
                                  key={column.id}
                                  className="capitalize focus:bg-zinc-900"
                                  checked={column.getIsVisible()}
                                  onCheckedChange={(value) =>
                                    column.toggleVisibility(!!value)
                                  }
                                >
                                  {column.id}
                                </DropdownMenuCheckboxItem>
                              );
                            })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="rounded-md border-none">
                      <Table className="rounded-md bg-zinc-950">
                        <TableHeader>
                          {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                              {headerGroup.headers.map((header) => {
                                return (
                                  <TableHead key={header.id}>
                                    {header.isPlaceholder
                                      ? null
                                      : flexRender(
                                          header.column.columnDef.header,
                                          header.getContext()
                                        )}
                                  </TableHead>
                                );
                              })}
                            </TableRow>
                          ))}
                        </TableHeader>
                        <TableBody className="border-none outline-none rounded-md">
                          {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                              <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                className=""
                              >
                                {row.getVisibleCells().map((cell) => (
                                  <TableCell key={cell.id}>
                                    {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext()
                                    )}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                              >
                                No results.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="flex items-center justify-end space-x-2 py-4">
                      <div className="flex-1 text-sm text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s)
                        selected.
                      </div>
                      <div className="space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => table.previousPage()}
                          disabled={!table.getCanPreviousPage()}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => table.nextPage()}
                          disabled={!table.getCanNextPage()}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </SignedIn>
      <SignedOut>
        <p>Redirecting...</p>
      </SignedOut>
    </>
  );
}
