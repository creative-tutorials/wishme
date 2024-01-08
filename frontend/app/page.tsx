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
import { useCategories } from "@/hooks/use-categories";
import { useCountryCodes } from "@/hooks/country-codes";
import { CategoriesCN } from "./types/categories";

import { Settings2, MoreHorizontal } from "lucide-react";
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
import { Wallet } from "lucide-react";

export type Product = {
  id: string;
  title: string;
  category: string;
  price: string;
  code: string;
  date: string;
};

type Err = {
  response: {
    data: {
      error: string;
    };
  };
};

export default function Home() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
    code: false,
  });
  const [rowSelection, setRowSelection] = useState({});
  const [count, setCount] = useState(0);
  const { toast } = useToast();
  const { isSignedIn, user } = useUser();
  const [formValue, setFormValue] = useState({
    title: "",
    category: "",
    price: "",
    code: "",
    isPending: false,
  });
  const [data, setData] = useState<Product[]>([]);

  const fetchExpenses = async () => {
    if (!isSignedIn) return;

    const url = getAPIURL();
    axios
      .get(`${url}/api/expense`, {
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
        setData([]);
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
      id: "id",
      accessorKey: "id",
      header: undefined,
      cell: () => null,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: "title",
      cell: ({ row }) => (
        <p className="capitalize whitespace-nowrap">{row.getValue("title")}</p>
      ),
    },
    {
      accessorKey: "category",
      header: "category",
      cell: ({ row }) => {
        const name: string = row.getValue("category");
        const split = name.substring(0, 30) + "...";

        return (
          <p className="whitespace-nowrap" title={name}>
            {split}
          </p>
        );
      },
    },
    {
      accessorKey: "code",
      header: "code",
      enableHiding: false,
      cell: ({ row }) => {
        const name: string = row.getValue("code");

        return (
          <p className="whitespace-nowrap" title={name}>
            {name}
          </p>
        );
      },
    },
    {
      accessorKey: "price",
      header: "price",
      cell: ({ row }) => {
        const pricing = parseInt(row.getValue("price"));

        // Format the pricing as a dollar pricing
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: row.getValue("code"),
        }).format(pricing);

        return (
          <p title={formatted} className="font-medium">
            {formatted}
          </p>
        );
      },
    },
    {
      accessorKey: "date",
      header: "date",
      cell: ({ row }) => (
        <p className="whitespace-nowrap">{row.getValue("date")}</p>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const deleteExpense = async () => {
          const id = row.getValue("id");
          const url = getAPIURL();

          if (!isSignedIn) {
            return;
          } else {
            axios
              .delete(`${url}/api/expense/${id}`, {
                headers: {
                  "Content-Type": "application/json",
                  apikey: process.env.NEXT_PUBLIC_API_KEY,
                },
              })
              .then((res) => {
                toast({
                  description: res.data.data,
                });
                fetchExpenses();
              })
              .catch((err) => {
                console.error(err.response);
                toast({
                  variant: "destructive",
                  description: err.response.data.error,
                });
              });
          }
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
                onClick={deleteExpense}
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

    count === 1 && fetchExpenses();

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
          title: formValue.title,
          category: formValue.category,
          price: formValue.price,
          code: formValue.code,
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
        fetchExpenses();
        setFormValue((prev) => ({
          ...prev,
          isPending: false,
          title: "",
          category: "",
          price: "",
          code: "",
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
    debugTable: true,
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="x bg-indigo-600 hover:bg-indigo-700 rounded flex gap-2">
                      <Wallet /> Record Expense
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-zinc-950 border border-zinc-700">
                    <DialogHeader>
                      <DialogTitle>Record an expense</DialogTitle>
                    </DialogHeader>
                    {/* add separator */}
                    <Separator className="my-1 bg-zinc-500" />
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-4">
                        <Label htmlFor="name" className="">
                          Title
                        </Label>
                        <Input
                          id="name"
                          autoComplete="off"
                          type="text"
                          placeholder="give your expense a name"
                          className="col-span-3 placeholder:text-gray-400"
                          disabled={formValue.isPending}
                          onChange={(e) =>
                            setFormValue({
                              ...formValue,
                              title: e.target.value,
                            })
                          }
                          value={formValue.title}
                        />
                      </div>
                      <div className="flex flex-col gap-4">
                        <Label htmlFor="username" className="">
                          Categories
                        </Label>
                        <Select
                          defaultValue={formValue.category}
                          disabled={formValue.isPending}
                          onValueChange={(value) =>
                            setFormValue({ ...formValue, category: value })
                          }
                        >
                          <SelectTrigger className="w-full text-gray-400">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {useCategories().map((category: CategoriesCN) => (
                              <SelectGroup key={category.key}>
                                <SelectLabel>{category.key}</SelectLabel>
                                {category.data.map((item) => (
                                  <SelectItem key={item} value={item}>
                                    {item}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col gap-4">
                        <Label htmlFor="price" className="">
                          Price
                        </Label>
                        <div className="flex md:flex-row lg:flex-row flex-col gap-4">
                          <Input
                            id="price"
                            autoComplete="off"
                            type="number"
                            placeholder="cost of the expense"
                            className="col-span-3 placeholder:text-gray-400"
                            disabled={formValue.isPending}
                            onChange={(e) =>
                              setFormValue({
                                ...formValue,
                                price: e.target.value,
                              })
                            }
                            value={formValue.price}
                          />
                          <Select
                            defaultValue={formValue.code}
                            disabled={formValue.isPending}
                            onValueChange={(value) =>
                              setFormValue({ ...formValue, code: value })
                            }
                          >
                            <SelectTrigger className="w-full text-gray-400">
                              <SelectValue placeholder="currency code" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Currency</SelectLabel>
                                {useCountryCodes().map((country) => (
                                  <SelectItem
                                    key={country.code}
                                    value={country.code}
                                  >
                                    {country.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
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
                  <h2 className="text-xl font-medium">Expense table</h2>
                </hgroup>
                <div id="list">
                  <div className="w-full">
                    <div className="flex flex-wrap md:gap-0 lg:gap-0 gap-4 items-center py-4">
                      <Input
                        placeholder="Filter by title..."
                        value={
                          (table
                            .getColumn("title")
                            ?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                          table
                            .getColumn("title")
                            ?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm border border-zinc-700"
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="ml-auto border border-zinc-700 hover:bg-zinc-600/20 flex items-center gap-1"
                          >
                            <Settings2 className="h-4 w-4" /> View
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
                      {/* limit the table to only show 5 per page */}
                      <Table className="rounded-md bg-zinc-950">
                        <TableHeader>
                          {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                              {headerGroup.headers.map((header) => {
                                return (
                                  <TableHead
                                    key={header.id}
                                    colSpan={header.colSpan}
                                  >
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
                      <div className="flex-1 flex md:flex-row lg:flex-row flex-col md:items-center lg:items-center gap-3 text-sm text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length >
                          0 && (
                          <span className="md:text-base lg:text-base text-sm">
                            {table.getFilteredSelectedRowModel().rows.length} of{" "}
                            {table.getFilteredRowModel().rows.length} row(s)
                            selected.
                          </span>
                        )}
                        <span className="md:text-base lg:text-base text-sm">
                          {table.getState().pagination.pageIndex + 1} of{" "}
                          {table.getPageCount()} page(s).
                        </span>
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
                      <div>
                        <Select
                          value={table
                            .getState()
                            .pagination.pageSize.toString()}
                          onValueChange={(value) =>
                            table.setPageSize(Number(value))
                          }
                          defaultValue={table
                            .getState()
                            .pagination.pageSize.toString()}
                        >
                          <SelectTrigger className="w-[100px] text-gray-400">
                            <SelectValue
                              placeholder={table.getState().pagination.pageSize}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Page Size</SelectLabel>
                              {[10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem
                                  key={pageSize}
                                  value={`${pageSize}`}
                                >
                                  Show {pageSize}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
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
