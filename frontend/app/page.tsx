"use client";

import axios from "axios";
import { useState, useEffect } from "react";
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

import Image from "next/image";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { CalendarCheck, User, BarChart2, Plus } from "lucide-react";

const data: Product[] = [
  {
    id: "abc-29-dnc93-fjdei",
    platform: "Amazon",
    pricing: 316,
    productName: "Macbook Pro 2021",
  },
  {
    id: "abc-29-dnc93-fjdei",
    platform: "Amazon",
    pricing: 242,
    productName: "success",
  },
  {
    id: "abc-29-dnc93-fjdei",
    platform: "Amazon",
    pricing: 837,
    productName: "processing",
  },
  {
    id: "abc-29-dnc93-fjdei",
    platform: "Amazon",
    pricing: 874,
    productName: "success",
  },
  {
    id: "abc-29-dnc93-fjdei",
    platform: "Amazon",
    pricing: 721,
    productName: "failed",
  },
];

export type Product = {
  id: string;
  platform: string;
  pricing: number;
  productName: string;
};

export const columns: ColumnDef<Product>[] = [
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
    accessorKey: "platform",
    header: "platform",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("platform")}</div>
    ),
  },
  {
    accessorKey: "productName",
    header: "Product Name",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("productName")}</div>
    ),
  },
  {
    accessorKey: "pricing",
    header: () => <div className="text-right">Pricing</div>,
    cell: ({ row }) => {
      const pricing = parseFloat(row.getValue("pricing"));

      // Format the pricing as a dollar pricing
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(pricing);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const product = row.original;

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
            className="bg-zinc-900 border border-zinc-700/50"
          >
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => alert("done")}
              className="focus:bg-zinc-800"
            >
              Mark as done
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-zinc-800">
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function Home() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [count, setCount] = useState(0);
  const [formValue, setFormValue] = useState({
    url: "",
    platform: "",
  });

  useEffect(() => {
    setCount((prev) => prev + 1);

    count === 1 && scrapeData();

    return () => {
      setCount(0);
    };
  }, [count]);
  const scrapeData = async () => {};

  const uploadData = async () => {
    axios
      .post(
        "http://localhost:8080/api/upload",
        {
          url: formValue.url,
          platform: formValue.platform,
        },
        {
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_API_KEY,
          },
        }
      )
      .then(async (res) => {
        console.log(res.data);
      })
      .catch(async (err) => {
        console.error(err.response);
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
    <main className="w-full h-screen">
      <div
        id="sidebar"
        className="fixed top-0 left-0 h-screen bg-zinc-900 p-9 md:flex lg:flex hidden flex-col gap-10 z-10"
      >
        <div id="logo">
          <Image
            src="/wishme logo.png"
            width={30}
            height={30}
            alt="wishme logo"
          />
        </div>
        <div id="links" className="flex flex-col gap-8">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/bought">
                  <CalendarCheck />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Bought item</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/profile">
                  <User />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Profile</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/analytics">
                  <BarChart2 />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Analytics</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div
        id="header"
        className="fixed top-0 left-0 w-full p-4 bg-[#080809]/50 backdrop-blur border-b border-zinc-800 z-10 md:hidden lg:hidden flex justify-between"
      >
        <div id="logo">
          <Image
            src="/wishme logo.png"
            width={30}
            height={30}
            alt="wishme logo"
          />
        </div>
        <div id="links" className="flex gap-8">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/bought">
                  <CalendarCheck />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Bought item</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/profile">
                  <User />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Profile</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/analytics">
                  <BarChart2 />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Analytics</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
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
              <DialogContent className="sm:max-w-[425px] bg-zinc-900 border border-zinc-700">
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
                      onChange={(e) =>
                        setFormValue({ ...formValue, url: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <Label htmlFor="username" className="">
                      Platform
                    </Label>
                    <Select
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
                    className="bg-indigo-700 hover:bg-indigo-600"
                    onClick={uploadData}
                  >
                    Upload data
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
                      className="bg-zinc-900 border border-zinc-700/50"
                    >
                      {table
                        .getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => {
                          return (
                            <DropdownMenuCheckboxItem
                              key={column.id}
                              className="capitalize focus:bg-zinc-800"
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
                  <Table className="x bg-zinc-900 border-none outline-none rounded-md">
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
                            className="x hover:bg-zinc-800 border-b border-zinc-500"
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
                    {table.getFilteredRowModel().rows.length} row(s) selected.
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
  );
}
